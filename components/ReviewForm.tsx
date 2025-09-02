"use client"
import { useState, useTransition } from 'react'
import { Select } from './ui/select'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { addReview } from '@/app/actions/review'
import { useToast } from './ui/toast'

export function ReviewForm({ projectId, gateId }: { projectId: string; gateId: string }) {
  const [decision, setDecision] = useState('APPROVED')
  const [comment, setComment] = useState('')
  const [isPending, startTransition] = useTransition()
  const { show } = useToast()
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await addReview({ projectId, gateId, decision: decision as any, comment })
      if (res?.ok) {
        setComment('')
        show({ title: 'Review submitted' })
      } else {
        show({ title: 'Error', description: res?.error ?? 'Failed to submit review' })
      }
    })
  }
  return (
    <form onSubmit={onSubmit} className="space-y-2" aria-label="Add review">
      <Select value={decision} onChange={(e) => setDecision(e.target.value)} options={[
        { value: 'APPROVED', label: 'Approve' },
        { value: 'REJECTED', label: 'Reject' },
        { value: 'REVISE', label: 'Revise' }
      ]} />
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows={3} />
      <Button type="submit" disabled={isPending || !comment.trim()}>{isPending ? 'Submitting…' : 'Submit Review'}</Button>
    </form>
  )
}
