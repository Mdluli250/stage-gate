"use server"
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'

export async function createStage(input: { projectId: string; name: string; description: string; order: number }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const stage = await prisma.stage.create({ data: input })
  await pusherServer.trigger(`project-${input.projectId}`, 'stage:new', { stage })
  return { ok: true }
}

export async function completeStage(id: string) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const stage = await prisma.stage.update({ where: { id }, data: { completed: true } })
  await pusherServer.trigger(`project-${stage.projectId}`, 'stage:update', { stage })
  return { ok: true }
}
