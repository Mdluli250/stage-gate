import { listProjects } from '@/app/actions/project'
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
    </main>
  )
}
