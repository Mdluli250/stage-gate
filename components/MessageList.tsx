"use client"
import { useEffect, useState } from 'react'
import { getPusherClient } from '@/lib/pusher'
import type { Message, User } from '@prisma/client'

type MessageWithSender = Message & { sender: User }

export function MessageList({ projectId, initial }: { projectId: string; initial: MessageWithSender[] }) {
  const [items, setItems] = useState<MessageWithSender[]>(initial)

  useEffect(() => {
    const pusher = getPusherClient()
    const channel = pusher.subscribe(`project-${projectId}`)
    const handler = (payload: { message: MessageWithSender }) => setItems((prev) => [payload.message, ...prev])
    channel.bind('message:new', handler)
    return () => {
      channel.unbind('message:new', handler)
      pusher.unsubscribe(`project-${projectId}`)
      pusher.disconnect()
    }
  }, [projectId])

  return (
    <ul className="space-y-2" aria-live="polite">
      {items.map((m) => (
        <li key={m.id} className="rounded border p-2">
          <div className="text-sm text-gray-600">{m.sender.name ?? m.sender.email}</div>
          <div>{m.content}</div>
        </li>
      ))}
    </ul>
  )
}
