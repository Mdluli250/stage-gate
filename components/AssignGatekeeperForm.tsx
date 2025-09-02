"use client"
import { useState, useTransition } from 'react'
import { Select } from './ui/select'
import { Button } from './ui/button'
import { assignGatekeeper } from '@/app/actions/gatekeeper'
import { useToast } from './ui/toast'

type Member = { id: string; name: string | null; email: string | null }

export function AssignGatekeeperForm({ gateId, members }: { gateId: string; members: Member[] }) {
  const [userId, setUserId] = useState(members[0]?.id ?? '')
  const [isPending, startTransition] = useTransition()
  const { show } = useToast()
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await assignGatekeeper({ gateId, userId })
      if (res?.ok) {
        show({ title: 'Gatekeeper assigned' })
      } else {
        show({ title: 'Error', description: res?.error ?? 'Failed to assign' })
      }
    })
  }
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2" aria-label="Assign gatekeeper">
      <Select value={userId} onChange={(e) => setUserId(e.target.value)} options={members.map((m) => ({ value: m.id, label: m.name ?? m.email ?? 'User' }))} />
      <Button type="submit" disabled={isPending || !userId}>Assign</Button>
    </form>
  )
}
