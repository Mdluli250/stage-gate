import { listNotifications, markNotificationRead } from '@/app/actions/notification'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function NotificationsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page ?? '1')
  const res = await listNotifications({ page })
  if (!res.ok) return <div className="p-6">Unauthorized</div>

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Notifications</h1>
      <ul className="space-y-3">
        {res.items.map((n) => (
          <li key={n.id} className="rounded border p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{n.type}</div>
              <div className="text-sm text-gray-600">{n.message}</div>
            </div>
            {!n.read ? (
              <form action={async () => { 'use server'; await markNotificationRead(n.id) }}>
                <Button type="submit" variant="outline">Mark read</Button>
              </form>
            ) : (
              <span className="text-sm text-gray-500">Read</span>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2">
        {page > 1 ? (
          <Link className="text-blue-600 underline" href={`?page=${page - 1}`} aria-label="Previous page">Previous</Link>
        ) : null}
        {res.total > page * res.pageSize ? (
          <Link className="text-blue-600 underline" href={`?page=${page + 1}`} aria-label="Next page">Next</Link>
        ) : null}
      </div>
    </main>
  )
}
