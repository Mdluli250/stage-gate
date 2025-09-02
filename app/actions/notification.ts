"use server"
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

const PAGE_SIZE = 10

export async function listNotifications(params: { page?: number }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const page = Math.max(1, params.page ?? 1)
  const [items, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    }),
    prisma.notification.count({ where: { userId: session.user.id } })
  ])
  return { ok: true, items, total, page, pageSize: PAGE_SIZE }
}

export async function markNotificationRead(id: string) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  await prisma.notification.update({ where: { id }, data: { read: true } })
  return { ok: true }
}
