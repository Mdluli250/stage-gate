"use server"
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'

export async function assignGatekeeper(input: { gateId: string; userId: string }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const gate = await prisma.gate.update({ where: { id: input.gateId }, data: { gatekeeperId: input.userId } })
  const stage = await prisma.stage.findUnique({ where: { id: gate.stageId } })
  if (stage) await pusherServer.trigger(`project-${stage.projectId}`, 'gate:update', { gate })
  return { ok: true }
}
