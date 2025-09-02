"use client"
import { useState, useTransition } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { createRedFlag } from '@/app/actions/redflag'
import { useToast } from './ui/toast'

export function RedFlagForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState(1)
  const [isPending, startTransition] = useTransition()
  const { show } = useToast()
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await createRedFlag({ projectId, title, severity })
      if (res?.ok) {
        setTitle('')
        setSeverity(1)
        show({ title: 'Red flag created' })
      } else {
        show({ title: 'Error', description: res?.error ?? 'Failed to create' })
      }
    })
  }
  return (
    <form onSubmit={onSubmit} className="space-y-2" aria-label="Create red flag">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <Input type="number" min={1} max={5} value={severity} onChange={(e) => setSeverity(Number(e.target.value))} required />
      <Button type="submit" disabled={isPending || !title.trim()}>{isPending ? 'Creating…' : 'Create'}</Button>
    </form>
  )
}
