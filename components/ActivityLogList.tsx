import type { ActivityLog } from '@prisma/client'

export function ActivityLogList({ items }: { items: ActivityLog[] }) {
  return (
    <ul className="space-y-1">
      {items.map((a) => (
        <li key={a.id} className="text-sm text-gray-700">
          <span className="font-mono text-gray-500">{new Date(a.createdAt).toLocaleString()}:</span> {a.action}
        </li>
      ))}
    </ul>
  )
}
