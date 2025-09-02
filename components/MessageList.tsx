"use client"
import { useEffect, useState } from 'react'
import { getPusherClient } from '@/lib/pusher'
import type { Message, User } from '@prisma/client'
import { Avatar } from './ui/avatar'

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
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Avatar name={m.sender.name} email={m.sender.email} imageUrl={m.sender.image} size={20} />
          </div>
          <div>{m.content}</div>
        </li>
      ))}
    </ul>
  )
}
