"use client"

import React, { useState, useMemo, useCallback } from 'react'
import { cn } from '../../lib/utils'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

export interface Column<T = any> {
  id: string
  header: string
  accessorKey?: keyof T
  accessor?: (item: T) => any
  cell?: (props: { value: any; row: T; column: Column<T> }) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: number | string
  minWidth?: number
  maxWidth?: number
  align?: 'left' | 'center' | 'right'
  type?: 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'badge' | 'actions'
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  error?: string | null
  title?: string
  description?: string
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
  paginated?: boolean
  pageSize?: number
  showPagination?: boolean
  rowsPerPageOptions?: number[]
  selectable?: boolean
  actions?: Array<{
    label: string
    icon?: React.ReactNode
    onClick: (row: T) => void
    variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  }>
  onRowClick?: (row: T) => void
  onExport?: () => void
  className?: string
  emptyMessage?: string
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void
}

type SortDirection = 'asc' | 'desc' | null

interface SortState {
  columnId: string | null
  direction: SortDirection
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  title,
  description,
  searchable = true,
  filterable = true,
  sortable = true,
  paginated = true,
  pageSize = 10,
  showPagination = true,
  rowsPerPageOptions = [5, 10, 20, 50],
  selectable = false,
  actions = [],
  onRowClick,
  onExport,
  className,
  emptyMessage = 'No data available',
  globalFilter = '',
  onGlobalFilterChange
}: DataTableProps<T>) {
  
  const [sorting, setSorting] = useState<SortState>({ columnId: null, direction: null })
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [internalGlobalFilter, setInternalGlobalFilter] = useState('')

  const effectiveGlobalFilter = onGlobalFilterChange ? globalFilter : internalGlobalFilter

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...data]

    // Global filter
    if (effectiveGlobalFilter && searchable) {
      result = result.filter(item =>
        columns.some(column => {
          const value = column.accessorKey 
            ? item[column.accessorKey]
            : column.accessor 
            ? column.accessor(item)
            : ''
          
          return String(value || '').toLowerCase().includes(effectiveGlobalFilter.toLowerCase())
        })
      )
    }

    // Column filters
    if (filterable) {
      Object.entries(columnFilters).forEach(([columnId, filterValue]) => {
        if (filterValue) {
          const column = columns.find(col => col.id === columnId)
          if (column) {
            result = result.filter(item => {
              const value = column.accessorKey 
                ? item[column.accessorKey]
                : column.accessor 
                ? column.accessor(item)
                : ''
              
              return String(value || '').toLowerCase().includes(filterValue.toLowerCase())
            })
          }
        }
      })
    }

    // Sorting
    if (sorting.columnId && sorting.direction && sortable) {
      const column = columns.find(col => col.id === sorting.columnId)
      if (column) {
        result.sort((a, b) => {
          const aValue = column.accessorKey 
            ? a[column.accessorKey]
            : column.accessor 
            ? column.accessor(a)
            : ''
          
          const bValue = column.accessorKey 
            ? b[column.accessorKey]
            : column.accessor 
            ? column.accessor(b)
            : ''

          if (aValue === bValue) return 0
          
          const comparison = aValue < bValue ? -1 : 1
          return sorting.direction === 'asc' ? comparison : -comparison
        })
      }
    }

    return result
  }, [data, columns, effectiveGlobalFilter, columnFilters, sorting, searchable, filterable, sortable])

  // Pagination
  const totalPages = Math.ceil(processedData.length / currentPageSize)
  const paginatedData = paginated 
    ? processedData.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize)
    : processedData

  const handleSort = useCallback((columnId: string) => {
    if (!sortable) return
    
    setSorting(current => {
      if (current.columnId === columnId) {
        switch (current.direction) {
          case 'asc':
            return { columnId, direction: 'desc' }
          case 'desc':
            return { columnId: null, direction: null }
          default:
            return { columnId, direction: 'asc' }
        }
      }
      return { columnId, direction: 'asc' }
    })
  }, [sortable])

  const handleColumnFilter = useCallback((columnId: string, value: string) => {
    setColumnFilters(current => ({
      ...current,
      [columnId]: value
    }))
    setCurrentPage(1) // Reset to first page when filtering
  }, [])

  const handleGlobalFilter = useCallback((value: string) => {
    if (onGlobalFilterChange) {
      onGlobalFilterChange(value)
    } else {
      setInternalGlobalFilter(value)
    }
    setCurrentPage(1) // Reset to first page when searching
  }, [onGlobalFilterChange])

  const handleRowSelect = useCallback((index: number) => {
    setSelectedRows(current => {
      const newSet = new Set(current)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((_, index) => index)))
    }
  }, [selectedRows.size, paginatedData.length])

  const getSortIcon = (columnId: string) => {
    if (sorting.columnId !== columnId) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />
    }
    
    switch (sorting.direction) {
      case 'asc':
        return <ChevronUp className="h-4 w-4 text-primary-600" />
      case 'desc':
        return <ChevronDown className="h-4 w-4 text-primary-600" />
      default:
        return <ChevronsUpDown className="h-4 w-4 text-gray-400" />
    }
  }

  const formatCellValue = (column: Column<T>, value: any, row: T) => {
    if (column.cell) {
      return column.cell({ value, row, column })
    }

    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('th-TH', {
          style: 'currency',
          currency: 'THB'
        }).format(value || 0)
      case 'percentage':
        return `${(value || 0).toFixed(1)}%`
      case 'number':
        return (value || 0).toLocaleString()
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-'
      case 'badge':
        return (
          <Badge variant={value?.variant || 'secondary'} className="capitalize">
            {value?.label || value || '-'}
          </Badge>
        )
      case 'actions':
        return (
          <div className="flex items-center gap-1">
            {actions.map((action, actionIndex) => (
              <Button
                key={actionIndex}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick(row)
                }}
                className="h-8 w-8 p-0"
              >
                {action.icon || <MoreHorizontal className="h-4 w-4" />}
              </Button>
            ))}
          </div>
        )
      default:
        return value || '-'
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      {(title || description || searchable || onExport) && (
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={effectiveGlobalFilter}
                    onChange={(e) => handleGlobalFilter(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              )}
              
              {onExport && (
                <Button variant="outline" onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {selectable && (
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                      column.sortable && sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth
                    }}
                    onClick={() => column.sortable && sortable && handleSort(column.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      {column.sortable && sortable && getSortIcon(column.id)}
                    </div>
                  </th>
                ))}
              </tr>
              
              {filterable && (
                <tr className="bg-gray-25 dark:bg-gray-750">
                  {selectable && <th className="px-4 py-2"></th>}
                  {columns.map((column) => (
                    <th key={`filter-${column.id}`} className="px-4 py-2">
                      {column.filterable && (
                        <Input
                          placeholder={`Filter ${column.header.toLowerCase()}...`}
                          value={columnFilters[column.id] || ''}
                          onChange={(e) => handleColumnFilter(column.id, e.target.value)}
                          className="h-8 text-xs"
                        />
                      )}
                    </th>
                  ))}
                </tr>
              )}
            </thead>
            
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={columns.length + (selectable ? 1 : 0)} 
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className={cn(
                      'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                      onRowClick && 'cursor-pointer',
                      selectedRows.has(index) && 'bg-primary-50 dark:bg-primary-900/20'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(index)}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleRowSelect(index)
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const value = column.accessorKey 
                        ? row[column.accessorKey]
                        : column.accessor 
                        ? column.accessor(row)
                        : ''
                      
                      return (
                        <td
                          key={column.id}
                          className={cn(
                            'px-4 py-3 text-sm text-gray-900 dark:text-gray-100',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {formatCellValue(column, value, row)}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {showPagination && paginated && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Rows per page:</span>
                <select
                  value={currentPageSize}
                  onChange={(e) => {
                    setCurrentPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                >
                  {rowsPerPageOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <span>
                  {((currentPage - 1) * currentPageSize) + 1} - {Math.min(currentPage * currentPageSize, processedData.length)} of {processedData.length}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="mx-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DataTable