"use server"
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'
import { GateDecision } from '@prisma/client'

export async function createGate(input: { stageId: string; name: string; description: string }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const gate = await prisma.gate.create({ data: input })
  const stage = await prisma.stage.findUnique({ where: { id: input.stageId } })
  if (stage) await pusherServer.trigger(`project-${stage.projectId}`, 'gate:new', { gate })
  return { ok: true }
}

export async function setGateDecision(input: { gateId: string; decision: GateDecision }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const gate = await prisma.gate.update({ where: { id: input.gateId }, data: { decision: input.decision, decidedAt: new Date() } })
  const stage = await prisma.stage.findUnique({ where: { id: gate.stageId } })
  if (stage) await pusherServer.trigger(`project-${stage.projectId}`, 'gate:update', { gate })
  return { ok: true }
}
