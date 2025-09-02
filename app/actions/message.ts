"use server"
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'

const PAGE_SIZE = 10

export async function sendMessage(input: { projectId: string; recipientId?: string | null; content: string }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const message = await prisma.message.create({
    data: {
      projectId: input.projectId,
      recipientId: input.recipientId ?? null,
      content: input.content,
      senderId: session.user.id
    },
    include: { sender: true }
  })
  await pusherServer.trigger(`project-${input.projectId}`, 'message:new', { message })
  if (input.recipientId) await pusherServer.trigger(`user-${input.recipientId}`, 'message:new', { message })
  return { ok: true }
}

export async function listMessages(params: { projectId: string; page?: number }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const page = Math.max(1, params.page ?? 1)
  const [items, total] = await Promise.all([
    prisma.message.findMany({
      where: { projectId: params.projectId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { sender: true }
    }),
    prisma.message.count({ where: { projectId: params.projectId } })
  ])
  return { ok: true, items, total, page, pageSize: PAGE_SIZE }
}
