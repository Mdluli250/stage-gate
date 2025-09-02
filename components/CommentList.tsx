"use client"
import { useEffect, useState } from 'react'
import type { Comment, User } from '@prisma/client'
import { Avatar } from './ui/avatar'
import { getPusherClient } from '@/lib/pusher'

type CommentWithUser = Comment & { user: User }

export function CommentList({ projectId, initial }: { projectId: string; initial: CommentWithUser[] }) {
  const [items, setItems] = useState<CommentWithUser[]>(initial)
  useEffect(() => {
    const pusher = getPusherClient()
    const channel = pusher.subscribe(`project-${projectId}`)
    const handler = (payload: { comment: CommentWithUser }) => setItems((prev) => [payload.comment, ...prev])
    channel.bind('comment:new', handler)
    return () => {
      channel.unbind('comment:new', handler)
      pusher.unsubscribe(`project-${projectId}`)
      pusher.disconnect()
    }
  }, [projectId])
  return (
    <ul className="space-y-2" aria-live="polite">
      {items.map((c) => (
        <li key={c.id} className="rounded border p-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Avatar name={c.user.name} email={c.user.email} imageUrl={c.user.image} size={20} />
          </div>
          <div>{c.content}</div>
        </li>
      ))}
    </ul>
  )
}
