"use client"
import { useTransition } from 'react'
import { Button } from './ui/button'
import { completeStage } from '@/app/actions/stage'
import { useToast } from './ui/toast'

export function StageCompleteButton({ stageId }: { stageId: string }) {
  const [isPending, startTransition] = useTransition()
  const { show } = useToast()
  const onClick = () => startTransition(async () => {
    const res = await completeStage(stageId)
    if (res?.ok) show({ title: 'Stage marked complete' })
    else show({ title: 'Error', description: res?.error ?? 'Failed to complete stage' })
  })
  return <Button onClick={onClick} disabled={isPending}>{isPending ? 'Completing…' : 'Complete Stage'}</Button>
}
