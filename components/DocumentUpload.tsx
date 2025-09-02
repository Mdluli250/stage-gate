"use client"
import { useState, useTransition } from 'react'
import { Button } from './ui/button'
import { uploadDocument } from '@/app/actions/sharepoint'
import { useToast } from './ui/toast'

export function DocumentUpload({ projectId }: { projectId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()
  const { show } = useToast()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      startTransition(async () => {
        const res = await uploadDocument({ projectId, name: file.name, base64 })
        if (res?.ok) show({ title: 'Uploaded', description: 'Document uploaded to SharePoint' })
        else show({ title: 'Error', description: res?.error ?? 'Upload failed' })
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2" aria-label="Upload document">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} aria-label="Choose document" />
      <Button type="submit" disabled={isPending || !file}>Upload</Button>
    </form>
  )
}
