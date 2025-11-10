'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type Table as TanStackTable,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import React from 'react'
import { Input } from '@/components/ui/input'

interface DataTableWithPaginationProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSizeOptions?: number[]
  initialPageSize?: number
  loading?: boolean
  serverPagination?: {
    total: number
    page: number // 1-based
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
}

export function DataTableWithPagination<TData, TValue>({
  columns,
  data,
  pageSizeOptions = [10, 20, 50, 100],
  initialPageSize,
  loading = false,
  serverPagination,
}: DataTableWithPaginationProps<TData, TValue>) {
  const defaultPageSize = initialPageSize ?? pageSizeOptions[0] ?? 10
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })
  const [sorting, setSorting] = React.useState<SortingState>([])
  // Sync internal pagination with external server pagination if provided
  React.useEffect(() => {
    if (serverPagination) {
      setPagination({
        pageIndex: Math.max(0, (serverPagination.page || 1) - 1),
        pageSize: serverPagination.pageSize || defaultPageSize,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverPagination?.page, serverPagination?.pageSize])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater
      setPagination(next)
      // When server-side mode, delegate changes outward
      if (serverPagination) {
        const nextPage = next.pageIndex + 1
        if (next.pageSize !== serverPagination.pageSize) {
          serverPagination.onPageSizeChange?.(next.pageSize)
        }
        if (nextPage !== serverPagination.page) {
          serverPagination.onPageChange?.(nextPage)
        }
      }
    },
    // Enable manual pagination for server-driven mode
    ...(serverPagination
      ? {
          manualPagination: true,
          pageCount: Math.max(
            1,
            Math.ceil((serverPagination.total || 0) / pagination.pageSize)
          ),
        }
      : {}),
  })

  return (
    <div className="w-full">
      <div className="overflow-x-auto border rounded-sm relative">
        <Table className="w-full table-auto">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const size =
                    typeof header.getSize === 'function'
                      ? header.getSize()
                      : (header.column?.getSize?.() ?? undefined)
                  return (
                    <TableHead
                      key={header.id}
                      style={size ? { width: `${size}px` } : undefined}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-gray-100">
                  {row.getVisibleCells().map((cell) => {
                    const size =
                      typeof cell.column.getSize === 'function'
                        ? cell.column.getSize()
                        : undefined
                    return (
                      <TableCell
                        key={cell.id}
                        style={size ? { width: `${size}px` } : undefined}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-500"
                >
                  No works found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {loading && (
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
            <Spinner className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </div>
        )}
      </div>

      <DataTablePagination
        table={table}
        pageSizeOptions={pageSizeOptions}
        totalOverride={serverPagination?.total}
        onPageChange={serverPagination?.onPageChange}
      />
    </div>
  )
}

interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>
  pageSizeOptions?: number[]
  totalOverride?: number
  onPageChange?: (page: number) => void
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 25, 30, 40, 50],
  totalOverride,
  onPageChange,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const derivedPageCount = table.getPageCount()
  const totalItems =
    typeof totalOverride === 'number'
      ? totalOverride
      : table.getFilteredRowModel().rows.length
  const pageCount = Math.max(
    derivedPageCount,
    Math.ceil(totalItems / Math.max(pageSize, 1))
  )

  // derive a small window of pages around current, capped to 5
  const maxButtons = 5
  const start = Math.max(0, pageIndex - Math.floor(maxButtons / 2))
  const end = Math.min(pageCount, start + maxButtons)
  const adjustedStart = Math.max(0, end - maxButtons)
  const pages = Array.from(
    { length: Math.max(0, end - adjustedStart) },
    (_, i) => adjustedStart + i
  )

  const goToPage = (n: number) => {
    const idx = Math.min(Math.max(n - 1, 0), Math.max(pageCount - 1, 0))
    if (onPageChange) {
      onPageChange(idx + 1)
    } else {
      table.setPageIndex(idx)
    }
  }

  return (
    <div className="flex items-center justify-end px-4 py-2 gap-2">
      {/* Total items */}
      <div className="text-sm">Total {totalItems} items</div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 "
          onClick={() => {
            const prev = pageIndex - 1
            if (prev >= 0) {
              if (onPageChange) onPageChange(prev + 1)
              else table.previousPage()
            }
          }}
          disabled={pageIndex <= 0}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p) => {
            const isCurrent = p === pageIndex
            return (
              <Button
                variant={isCurrent ? 'secondary' : 'ghost'}
                key={p}
                type="button"
                onClick={() => {
                  if (onPageChange) onPageChange(p + 1)
                  else table.setPageIndex(p)
                }}
                className={`h-9 min-w-9 px-2 text-sm ${isCurrent ? 'hover:bg-secondary' : ''}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {p + 1}
              </Button>
            )
          })}
        </div>

        {/* Next */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 "
          onClick={() => {
            const next = pageIndex + 1
            if (next <= pageCount - 1) {
              if (onPageChange) onPageChange(next + 1)
              else table.nextPage()
            }
          }}
          disabled={pageIndex >= pageCount - 1}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Right-side: page size and go to */}
      <div className="flex items-center gap-3">
        {/* Page size */}
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            const size = Number(value)
            if (onPageChange) {
              // reset to first page when page size changes in server mode
              table.setPageSize(size)
              onPageChange(1)
            } else {
              table.setPageSize(size)
            }
          }}
        >
          <SelectTrigger className="h-9 w-[120px]  bg-[#F7F8FA]">
            <SelectValue placeholder={`${pageSize} / Page`} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((n) => (
              <SelectItem key={n} value={`${n}`}>{`${n} / Page`}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Go to */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Go to</span>
          <Input
            type="number"
            min={1}
            max={Math.max(pageCount, 1)}
            defaultValue={pageIndex + 1}
            className="h-9 w-[56px]  bg-[#F7F8FA] px-2 text-center"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement
                const value = Number(target.value)
                if (!Number.isNaN(value)) {
                  goToPage(value)
                }
              }
            }}
            onBlur={(e) => {
              const value = Number(e.currentTarget.value)
              if (!Number.isNaN(value)) {
                goToPage(value)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
