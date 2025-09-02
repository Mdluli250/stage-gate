const tokenEndpoint = (tenantId: string) => `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`

async function getAppAccessToken(): Promise<string> {
  const tenantId = process.env.MICROSOFT_ENTRA_ID_TENANT_ID as string
  const clientId = process.env.MICROSOFT_ENTRA_ID_CLIENT_ID as string
  const clientSecret = process.env.MICROSOFT_ENTRA_ID_CLIENT_SECRET as string
  const params = new URLSearchParams()
  params.set('grant_type', 'client_credentials')
  params.set('client_id', clientId)
  params.set('client_secret', clientSecret)
  params.set('scope', 'https://graph.microsoft.com/.default')
  const res = await fetch(tokenEndpoint(tenantId), { method: 'POST', body: params })
  if (!res.ok) throw new Error('Failed to get Graph token')
  const json = await res.json()
  return json.access_token as string
}

export async function graphFetch<T>(path: string, init?: RequestInit, bearer?: string): Promise<T> {
  const token = bearer ?? (await getAppAccessToken())
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Graph error ${res.status}: ${text}`)
  }
  if (res.status === 204) return undefined as unknown as T
  return (await res.json()) as T
}

export async function uploadDriveItem(opts: { driveId: string; name: string; content: Buffer | Uint8Array | string }): Promise<{ id: string; webUrl: string; name: string }> {
  const token = await getAppAccessToken()
  const { driveId, name, content } = opts
  const res = await fetch(`https://graph.microsoft.com/v1.0/drives/${driveId}/root:/${encodeURIComponent(name)}:/content`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/octet-stream'
    },
    body: typeof content === 'string' ? Buffer.from(content, 'base64') : content
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed: ${res.status} ${text}`)
  }
  const json = await res.json()
  return { id: json.id, webUrl: json.webUrl, name: json.name }
}

export async function listDriveChildren(driveId: string, folderPath = ''): Promise<{ id: string; name: string; webUrl: string }[]> {
  const path = folderPath ? `/drives/${driveId}/root:/${encodeURIComponent(folderPath)}:/children` : `/drives/${driveId}/root/children`
  const data = await graphFetch<{ value: { id: string; name: string; webUrl: string }[] }>(path)
  return data.value
}

export async function listDriveItemVersions(driveId: string, itemId: string): Promise<{ id: string; lastModifiedDateTime: string; size: number }[]> {
  const data = await graphFetch<{ value: { id: string; lastModifiedDateTime: string; size: number }[] }>(`/drives/${driveId}/items/${itemId}/versions`)
  return data.value
}
