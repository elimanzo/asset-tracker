import { Button } from '@/components/ui/button'

interface PaginationBarProps {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
}

export function PaginationBar({ page, pageSize, totalCount, onPageChange }: PaginationBarProps) {
  const totalPages = Math.ceil(totalCount / pageSize)
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalCount)

  if (totalCount === 0) return null

  return (
    <div className="flex items-center justify-between px-1 py-2 text-sm">
      <p className="text-muted-foreground">
        Showing {from}–{to} of {totalCount}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
