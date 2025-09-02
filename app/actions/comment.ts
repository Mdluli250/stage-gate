"use server"
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'

const PAGE_SIZE = 10

export async function addComment(input: { projectId: string; content: string }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const comment = await prisma.comment.create({
    data: { projectId: input.projectId, content: input.content, userId: session.user.id },
    include: { user: true }
  })
  await pusherServer.trigger(`project-${input.projectId}`, 'comment:new', { comment })
  return { ok: true }
}

export async function listComments(params: { projectId: string; page?: number }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const page = Math.max(1, params.page ?? 1)
  const [items, total] = await Promise.all([
    prisma.comment.findMany({
      where: { projectId: params.projectId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: true }
    }),
    prisma.comment.count({ where: { projectId: params.projectId } })
  ])
  return { ok: true, items, total, page, pageSize: PAGE_SIZE }
}
