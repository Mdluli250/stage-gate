"use server"
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { uploadDriveItem, listDriveChildren, listDriveItemVersions } from '@/lib/graph'

const DRIVE_ID = process.env.SHAREPOINT_DRIVE_ID as string

export async function uploadDocument(input: { projectId: string; name: string; base64: string }) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const uploaded = await uploadDriveItem({ driveId: DRIVE_ID, name: input.name, content: input.base64 })
  await prisma.document.create({
    data: {
      projectId: input.projectId,
      name: uploaded.name,
      sharepointId: uploaded.id,
      sharepointUrl: uploaded.webUrl,
      uploadedById: session.user.id
    }
  })
  return { ok: true, url: uploaded.webUrl }
}

export async function listDocuments(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  const docs = await prisma.document.findMany({ where: { projectId }, orderBy: { uploadedAt: 'desc' } })
  return { ok: true, items: docs }
}

export async function listSharePointFolder(path = '') {
  const items = await listDriveChildren(DRIVE_ID, path)
  return { ok: true, items }
}

export async function listSharePointVersions(itemId: string) {
  const versions = await listDriveItemVersions(DRIVE_ID, itemId)
  return { ok: true, versions }
}
