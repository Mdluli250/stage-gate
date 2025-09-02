"use client"
import { useState, useTransition } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Select } from './ui/select'
import { sendMessage } from '@/app/actions/message'
import { useToast } from './ui/toast'

type Member = { id: string; name: string | null; email: string | null }

export function MessageForm({ projectId, members = [] as Member[], recipientId }: { projectId: string; members?: Member[]; recipientId?: string }) {
  const [content, setContent] = useState('')
  const [recipient, setRecipient] = useState<string | undefined>(recipientId)
  const [isPending, startTransition] = useTransition()
  const { show } = useToast()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await sendMessage({ projectId, recipientId: recipient, content })
      if (res?.ok) {
        setContent('')
        show({ title: 'Message sent' })
      } else {
        show({ title: 'Error', description: res?.error ?? 'Failed to send' })
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2" aria-label="Send message">
      {members.length > 0 ? (
        <Select
          aria-label="Select recipient"
          value={recipient ?? ''}
          onChange={(e) => setRecipient(e.target.value || undefined)}
          options={[{ value: '', label: 'Broadcast to project' }, ...members.map((m) => ({ value: m.id, label: m.name ?? m.email ?? 'User' }))]}
        />
      ) : null}
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={3} />
      <Button type="submit" disabled={isPending || !content.trim()}>{isPending ? 'Sending…' : 'Send'}</Button>
    </form>
  )
}
