"use server"
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'

const PAGE_SIZE = 10

export async function createRedFlag(input: { projectId: string; title: string; severity: number }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const rf = await prisma.redFlag.create({ data: { projectId: input.projectId, title: input.title, severity: input.severity } })
  await pusherServer.trigger(`project-${input.projectId}`, 'redflag:new', { redFlag: rf })
  return { ok: true }
}

export async function closeRedFlag(id: string) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const rf = await prisma.redFlag.update({ where: { id }, data: { status: 'closed' } })
  await pusherServer.trigger(`project-${rf.projectId}`, 'redflag:update', { redFlag: rf })
  return { ok: true }
}

export async function listRedFlags(params: { projectId: string; page?: number }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const page = Math.max(1, params.page ?? 1)
  const [items, total] = await Promise.all([
    prisma.redFlag.findMany({
      where: { projectId: params.projectId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.redFlag.count({ where: { projectId: params.projectId } })
  ])
  return { ok: true, items, total, page, pageSize: PAGE_SIZE }
}
