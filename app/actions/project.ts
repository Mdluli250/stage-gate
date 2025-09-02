"use server"
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'

const PAGE_SIZE = 10

export async function createProject(input: { name: string; description: string }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const project = await prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      ownerId: session.user.id,
      members: {
        create: [{ userId: session.user.id, role: 'OWNER' }]
      },
      activityLogs: {
        create: [{ userId: session.user.id, action: 'PROJECT_CREATED' }]
      }
    }
  })
  await pusherServer.trigger(`user-${session.user.id}`, 'project:created', { projectId: project.id })
  return { ok: true, projectId: project.id }
}

export async function listProjects(params: { query?: string; page?: number }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const page = Math.max(1, params.page ?? 1)
  const where = {
    members: { some: { userId: session.user.id } },
    ...(params.query
      ? { OR: [{ name: { contains: params.query, mode: 'insensitive' } }, { description: { contains: params.query, mode: 'insensitive' } }] }
      : {})
  }
  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { stages: true, redFlags: true, reviews: true }
    }),
    prisma.project.count({ where })
  ])
  return { ok: true, items, total, page, pageSize: PAGE_SIZE }
}

export async function getProject(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const project = await prisma.project.findFirst({
    where: { id: projectId, members: { some: { userId: session.user.id } } },
    include: {
      stages: { include: { gates: true }, orderBy: { order: 'asc' } },
      redFlags: true,
      reviews: { include: { gate: true, user: true }, orderBy: { createdAt: 'desc' } },
      members: { include: { user: true } },
      activityLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
      documents: { orderBy: { uploadedAt: 'desc' }, take: 20 }
    }
  })
  if (!project) return { ok: false, error: 'Not found' }
  return { ok: true, project }
}
