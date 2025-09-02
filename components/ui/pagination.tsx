type Props = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const prev = () => onPageChange(Math.max(1, page - 1))
  const next = () => onPageChange(Math.min(totalPages, page + 1))
  return (
    <nav className="mt-4 flex items-center justify-between" aria-label="Pagination">
      <button className="px-3 py-2 border rounded disabled:opacity-50" onClick={prev} disabled={page <= 1} aria-label="Previous page">Previous</button>
      <span className="text-sm" aria-live="polite">Page {page} of {totalPages}</span>
      <button className="px-3 py-2 border rounded disabled:opacity-50" onClick={next} disabled={page >= totalPages} aria-label="Next page">Next</button>
    </nav>
  )
}

export default Pagination
