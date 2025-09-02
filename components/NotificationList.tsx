import type { Notification } from '@prisma/client'

export function NotificationList({ items }: { items: Notification[] }) {
  return (
    <ul className="space-y-2">
      {items.map((n) => (
        <li key={n.id} className="rounded border p-2">
          <div className="font-medium">{n.type}</div>
          <div className="text-sm text-gray-600">{n.message}</div>
        </li>
      ))}
    </ul>
  )
}
