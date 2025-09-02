"use client"
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'

export function ChartContainer({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-64">{children}</div>
}

export function PieChartSimple({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8" label />
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function BarChartSimple({ data, dataKey, nameKey }: { data: any[]; dataKey: string; nameKey: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={nameKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill="#1f77b4" />
      </BarChart>
    </ResponsiveContainer>
  )
}
