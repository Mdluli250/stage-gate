"use client"
import { useState, useTransition } from 'react'
import { Select } from './ui/select'
import { Button } from './ui/button'
import { setGateDecision } from '@/app/actions/gate'
import { useToast } from './ui/toast'

export function GateDecisionForm({ gateId }: { gateId: string }) {
  const [decision, setDecision] = useState('APPROVED')
  const [isPending, startTransition] = useTransition()
  const { show } = useToast()
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await setGateDecision({ gateId, decision: decision as any })
      if (res?.ok) {
        show({ title: 'Decision recorded' })
      } else {
        show({ title: 'Error', description: res?.error ?? 'Failed to record decision' })
      }
    })
  }
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2" aria-label="Set gate decision">
      <Select value={decision} onChange={(e) => setDecision(e.target.value)} options={[
        { value: 'APPROVED', label: 'Approve' },
        { value: 'REJECTED', label: 'Reject' },
        { value: 'REVISE', label: 'Revise' }
      ]} />
      <Button type="submit" disabled={isPending}>Save</Button>
    </form>
  )
}
