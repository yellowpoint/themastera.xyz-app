"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type Table as TanStackTable,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";

interface DataTableWithPaginationProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSizeOptions?: number[];
  initialPageSize?: number;
}

export function DataTableWithPagination<TData, TValue>({
  columns,
  data,
  pageSizeOptions = [10, 20, 25, 30, 40, 50],
  initialPageSize,
}: DataTableWithPaginationProps<TData, TValue>) {
  const defaultPageSize = initialPageSize ?? pageSizeOptions[0] ?? 10;
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);
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
    onPaginationChange: setPagination,
  });

  return (
    <div className="w-full">
      <div className="overflow-hidden border border-gray-200 rounded-sm">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-100 hover:bg-gray-100"
              >
                {headerGroup.headers.map((header) => {
                  const size = typeof header.getSize === "function" ? header.getSize() : (header.column?.getSize?.() ?? undefined);
                  return (
                    <TableHead
                      key={header.id}
                      className="font-normal text-[#3B3E3F]"
                      style={size ? { width: `${size}px` } : undefined}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-gray-100">
                  {row.getVisibleCells().map((cell) => {
                    const size = typeof cell.column.getSize === "function" ? cell.column.getSize() : undefined;
                    return (
                      <TableCell key={cell.id} style={size ? { width: `${size}px` } : undefined}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
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
      </div>

      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
    </div>
  );
}

interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 25, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const totalItems = table.getFilteredRowModel().rows.length;

  // derive a small window of pages around current, capped to 5
  const maxButtons = 5;
  const start = Math.max(0, pageIndex - Math.floor(maxButtons / 2));
  const end = Math.min(pageCount, start + maxButtons);
  const adjustedStart = Math.max(0, end - maxButtons);
  const pages = Array.from(
    { length: Math.max(0, end - adjustedStart) },
    (_, i) => adjustedStart + i
  );

  const goToPage = (n: number) => {
    const idx = Math.min(Math.max(n - 1, 0), Math.max(pageCount - 1, 0));
    table.setPageIndex(idx);
  };

  return (
    <div className="flex items-center justify-end px-4 py-2 gap-2">
      {/* Total items */}
      <div className="text-sm text-[#1D2129]">Total {totalItems} items</div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-[2px]"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p) => {
            const isCurrent = p === pageIndex;
            return (
              <Button
                variant="ghost"
                key={p}
                type="button"
                onClick={() => table.setPageIndex(p)}
                className={
                  `h-9 min-w-9 rounded-[2px] px-2 text-sm ` +
                  (isCurrent
                    ? "bg-[#F4E8FF] text-[#805333] hover:bg-[#F4E8FF]"
                    : "text-[#4E5969] hover:bg-gray-100")
                }
                aria-current={isCurrent ? "page" : undefined}
              >
                {p + 1}
              </Button>
            );
          })}
        </div>

        {/* Next */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-[2px]"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
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
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-9 w-[120px] rounded-[2px] bg-[#F7F8FA]">
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
          <span className="text-sm text-[#86909C]">Go to</span>
          <Input
            type="number"
            min={1}
            max={Math.max(pageCount, 1)}
            defaultValue={pageIndex + 1}
            className="h-9 w-[56px] rounded-[2px] bg-[#F7F8FA] px-2 text-center"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const target = e.target as HTMLInputElement;
                const value = Number(target.value);
                if (!Number.isNaN(value)) {
                  goToPage(value);
                }
              }
            }}
            onBlur={(e) => {
              const value = Number(e.currentTarget.value);
              if (!Number.isNaN(value)) {
                goToPage(value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
