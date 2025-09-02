import { NextRequest } from 'next/server'

async function getAppAccessToken(): Promise<string> {
  const tenantId = process.env.MICROSOFT_ENTRA_ID_TENANT_ID as string
  const clientId = process.env.MICROSOFT_ENTRA_ID_CLIENT_ID as string
  const clientSecret = process.env.MICROSOFT_ENTRA_ID_CLIENT_SECRET as string
  const params = new URLSearchParams()
  params.set('grant_type', 'client_credentials')
  params.set('client_id', clientId)
  params.set('client_secret', clientSecret)
  params.set('scope', 'https://graph.microsoft.com/.default')
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, { method: 'POST', body: params })
  if (!res.ok) return ''
  const json = await res.json()
  return json.access_token as string
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const id = searchParams.get('id')
  if (!email && !id) return new Response('Missing identifier', { status: 400 })
  const token = await getAppAccessToken()
  if (!token) return new Response('Auth error', { status: 500 })
  const userPath = id ? `/users/${encodeURIComponent(id)}` : `/users/${encodeURIComponent(email as string)}`
  const res = await fetch(`https://graph.microsoft.com/v1.0${userPath}/photo/$value`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) return new Response(null, { status: 204 })
  const arrayBuffer = await res.arrayBuffer()
  return new Response(Buffer.from(arrayBuffer), {
    headers: { 'Content-Type': res.headers.get('Content-Type') || 'image/jpeg', 'Cache-Control': 'public, max-age=86400' }
  })
}
