"use client"
import { useState, useTransition } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { addComment } from '@/app/actions/comment'
import { useToast } from './ui/toast'

export function CommentForm({ projectId }: { projectId: string }) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const { show } = useToast()
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await addComment({ projectId, content })
      if (res?.ok) {
        setContent('')
        show({ title: 'Comment added' })
      } else {
        show({ title: 'Error', description: res?.error ?? 'Failed to add comment' })
      }
    })
  }
  return (
    <form onSubmit={onSubmit} className="space-y-2" aria-label="Add comment">
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={3} />
      <Button type="submit" disabled={isPending || !content.trim()}>{isPending ? 'Posting…' : 'Post Comment'}</Button>
    </form>
  )
}
