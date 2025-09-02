"use client"
import { useState, useTransition } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { sendMessage } from '@/app/actions/message'
import { useToast } from './ui/toast'

export function MessageForm({ projectId, recipientId }: { projectId: string; recipientId?: string }) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const { show } = useToast()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await sendMessage({ projectId, recipientId, content })
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
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={3} />
      <Button type="submit" disabled={isPending || !content.trim()}>{isPending ? 'Sending…' : 'Send'}</Button>
    </form>
  )
}
