import { listProjects } from '@/app/actions/project'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChartContainer, PieChartSimple, BarChartSimple } from '@/components/ui/chart'

export default async function DashboardPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const page = Number(searchParams.page ?? '1')
  const q = searchParams.q
  const res = await listProjects({ query: q, page })
  if (!res.ok) return <div className="p-6">Unauthorized</div>
  const { items } = res

  const progressData = items.map((p) => ({ name: p.name, value: p.stages.filter((s) => s.completed).length }))
  const redFlagData = [
    { name: 'Open', value: items.reduce((acc, p) => acc + p.redFlags.filter((r) => r.status === 'open').length, 0) },
    { name: 'Closed', value: items.reduce((acc, p) => acc + p.redFlags.filter((r) => r.status !== 'open').length, 0) },
  ]
  const gateReviewData = items.map((p) => ({ name: p.name, value: p.reviews.length }))

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <form className="flex items-center gap-2" action="/dashboard" method="GET" role="search" aria-label="Search projects">
        <input className="h-9 w-full max-w-sm rounded-md border border-gray-300 px-3" type="text" name="q" defaultValue={q} placeholder="Search projects…" aria-label="Search term" />
        <button className="h-9 px-4 rounded-md bg-gray-900 text-white" type="submit">Search</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>Project Progress</CardHeader>
          <CardContent>
            <ChartContainer>
              <BarChartSimple data={progressData} dataKey="value" nameKey="name" />
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Red Flags</CardHeader>
          <CardContent>
            <ChartContainer>
              <PieChartSimple data={redFlagData} />
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Gate Reviews</CardHeader>
          <CardContent>
            <ChartContainer>
              <BarChartSimple data={gateReviewData} dataKey="value" nameKey="name" />
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((p) => (
          <Link key={p.id} href={`/project/${p.id}`} className="rounded border p-3 hover:bg-gray-50" aria-label={`Open project ${p.name}`}>
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
