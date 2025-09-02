"use client"
import { useState, useTransition } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { createProject } from '@/app/actions/project'
import { useToast } from './ui/toast'

export function ProjectForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPending, startTransition] = useTransition()
  const { show } = useToast()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await createProject({ name, description })
      if (res?.ok) {
        setName('')
        setDescription('')
        show({ title: 'Project created' })
      } else {
        show({ title: 'Error', description: res?.error ?? 'Failed to create project' })
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" aria-label="Create project form">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required aria-required />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} aria-required />
      </div>
      <Button type="submit" disabled={isPending}>{isPending ? 'Creating…' : 'Create'}</Button>
    </form>
  )
}
