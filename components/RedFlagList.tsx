"use client"
import { useEffect, useState } from 'react'
import type { RedFlag } from '@prisma/client'
import { getPusherClient } from '@/lib/pusher'

export function RedFlagList({ projectId, initial }: { projectId: string; initial: RedFlag[] }) {
  const [items, setItems] = useState<RedFlag[]>(initial)
  useEffect(() => {
    const p = getPusherClient()
    const channel = p.subscribe(`project-${projectId}`)
    const onNew = (payload: { redFlag: RedFlag }) => setItems((prev) => [payload.redFlag, ...prev])
    const onUpd = (payload: { redFlag: RedFlag }) => setItems((prev) => prev.map((r) => (r.id === payload.redFlag.id ? payload.redFlag : r)))
    channel.bind('redflag:new', onNew)
    channel.bind('redflag:update', onUpd)
    return () => {
      channel.unbind('redflag:new', onNew)
      channel.unbind('redflag:update', onUpd)
      p.unsubscribe(`project-${projectId}`)
      p.disconnect()
    }
  }, [projectId])
  return (
    <ul className="space-y-2">
      {items.map((r) => (
        <li key={r.id} className="rounded border p-2 flex items-center justify-between">
          <div>
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-gray-600">Severity: {r.severity} | {r.status}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}
