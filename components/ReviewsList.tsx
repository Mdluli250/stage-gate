"use client"
import { useEffect, useState } from 'react'
import type { Review, User, Gate } from '@prisma/client'
import { getPusherClient } from '@/lib/pusher'

type ReviewFull = Review & { user: User; gate: Gate }

export function ReviewsList({ projectId, initial }: { projectId: string; initial: ReviewFull[] }) {
  const [items, setItems] = useState<ReviewFull[]>(initial)
  useEffect(() => {
    const p = getPusherClient()
    const channel = p.subscribe(`project-${projectId}`)
    const onNew = (payload: { review: ReviewFull }) => setItems((prev) => [payload.review, ...prev])
    channel.bind('review:new', onNew)
    return () => {
      channel.unbind('review:new', onNew)
      p.unsubscribe(`project-${projectId}`)
      p.disconnect()
    }
  }, [projectId])
  return (
    <ul className="space-y-2">
      {items.map((r) => (
        <li key={r.id} className="rounded border p-2">
          <div className="text-sm text-gray-600">{r.user.name ?? r.user.email} on {r.gate.name}</div>
          <div className="font-medium">{r.decision}</div>
          <div>{r.comment}</div>
        </li>
      ))}
    </ul>
  )
}
