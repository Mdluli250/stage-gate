export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export type Role = 'OWNER' | 'GATEKEEPER' | 'MEMBER'

export type GateDecision = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISE'

export type ChartDataPoint = { name: string; value: number }
