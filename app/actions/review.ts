"use server"
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'
import { GateDecision } from '@prisma/client'

const PAGE_SIZE = 10

export async function addReview(input: { projectId: string; gateId: string; decision: GateDecision; comment: string }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const review = await prisma.review.create({ data: { ...input, userId: session.user.id }, include: { user: true } })
  await pusherServer.trigger(`project-${input.projectId}`, 'review:new', { review })
  return { ok: true }
}

export async function listReviews(params: { projectId: string; page?: number }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const page = Math.max(1, params.page ?? 1)
  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where: { projectId: params.projectId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: true, gate: true }
    }),
    prisma.review.count({ where: { projectId: params.projectId } })
  ])
  return { ok: true, items, total, page, pageSize: PAGE_SIZE }
}
