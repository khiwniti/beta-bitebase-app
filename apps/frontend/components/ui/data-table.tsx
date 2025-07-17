import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Download, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  title?: string;
  description?: string;
  data: any[];
  columns: Column[];
  className?: string;
  searchable?: boolean;
  exportable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export function DataTable({
  title,
  description,
  data,
  columns,
  className,
  searchable = false,
  exportable = false,
  pagination = false,
  pageSize = 10,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  }>({
    key: '',
    direction: null
  });
  const [announcement, setAnnouncement] = useState('');
  const tableId = React.useId();
  const titleId = React.useId();
  const descriptionId = React.useId();

  // Filter data based on search query
  const filteredData = searchQuery
    ? data.filter(item => 
        Object.values(item).some(
          value => 
            value && 
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data;

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] === b[sortConfig.key]) return 0;
      
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      } else {
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      }
    });
  }, [filteredData, sortConfig.direction, sortConfig.key]);

  // Paginate data
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  // Total pages for pagination
  const totalPages = pagination ? Math.ceil(sortedData.length / pageSize) : 1;

  // Handle sort
  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    let newDirection: 'asc' | 'desc' | null;
    let announcement = '';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ key, direction: 'desc' });
        newDirection = 'desc';
        announcement = `Table sorted by ${column?.title || key} in descending order`;
      } else if (sortConfig.direction === 'desc') {
        setSortConfig({ key: '', direction: null });
        newDirection = null;
        announcement = `Sorting removed from table`;
      } else {
        setSortConfig({ key, direction: 'asc' });
        newDirection = 'asc';
        announcement = `Table sorted by ${column?.title || key} in ascending order`;
      }
    } else {
      setSortConfig({ key, direction: 'asc' });
      newDirection = 'asc';
      announcement = `Table sorted by ${column?.title || key} in ascending order`;
    }
    
    setAnnouncement(announcement);
    setTimeout(() => setAnnouncement(''), 1000);
  };

  // Handle export
  const handleExport = () => {
    try {
      // Create CSV content
      const headers = columns.map(col => col.title).join(',');
      const rows = sortedData.map(row => 
        columns.map(col => row[col.key] !== undefined ? `"${row[col.key]}"` : '""').join(',')
      ).join('\n');
      const csv = `${headers}\n${rows}`;
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${title || 'data'}-export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <>
    <div className={cn("bg-white border rounded-lg shadow-sm", className)}>
      {/* Header */}
      {(title || description || searchable || exportable) && (
        <div className="p-4 border-b">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              {title && <h3 id={titleId} className="text-lg font-medium">{title}</h3>}
              {description && <p id={descriptionId} className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <div className="flex items-center space-x-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search table data"
                    aria-describedby={searchQuery ? undefined : `${tableId}-search-help`}
                    className="h-9 rounded-md border border-gray-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {!searchQuery && (
                    <div id={`${tableId}-search-help`} className="sr-only">
                      Type to search table data
                    </div>
                  )}
                </div>
              )}
              {exportable && (
                <button
                  onClick={handleExport}
                  aria-label={`Export ${title || 'table'} data as CSV`}
                  className="h-9 px-3 rounded-md border border-gray-300 bg-white text-gray-700 flex items-center text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-1" aria-hidden="true" />
                  Export
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table 
          className="w-full divide-y divide-gray-200"
          role="table"
          aria-label={ariaLabel || `${title || 'Data'} table`}
          aria-labelledby={ariaLabelledBy || (title ? titleId : undefined)}
          aria-describedby={ariaDescribedBy || (description ? descriptionId : undefined)}
          aria-rowcount={sortedData.length + 1}
          aria-colcount={columns.length}
        >
          <thead className="bg-gray-50">
            <tr role="row">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  scope="col"
                  role="columnheader"
                  aria-colindex={idx + 1}
                  aria-sort={
                    column.sortable && sortConfig.key === column.key
                      ? sortConfig.direction === 'asc'
                        ? 'ascending'
                        : sortConfig.direction === 'desc'
                        ? 'descending'
                        : 'none'
                      : column.sortable
                      ? 'none'
                      : undefined
                  }
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.sortable && "cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                  onKeyDown={(e) => {
                    if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSort(column.key);
                    }
                  }}
                  tabIndex={column.sortable ? 0 : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span aria-hidden="true">
                        {sortConfig.key === column.key && sortConfig.direction === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : sortConfig.key === column.key && sortConfig.direction === 'desc' ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                  {column.sortable && (
                    <span className="sr-only">
                      {sortConfig.key === column.key
                        ? sortConfig.direction === 'asc'
                          ? 'Sorted ascending. Click to sort descending.'
                          : sortConfig.direction === 'desc'
                          ? 'Sorted descending. Click to remove sorting.'
                          : 'Not sorted. Click to sort ascending.'
                        : 'Not sorted. Click to sort ascending.'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => {
                const actualRowIndex = pagination ? (currentPage - 1) * pageSize + rowIdx : rowIdx;
                return (
                  <tr 
                    key={rowIdx} 
                    role="row"
                    aria-rowindex={actualRowIndex + 2}
                    className="hover:bg-gray-50"
                  >
                    {columns.map((column, colIdx) => (
                      <td 
                        key={colIdx} 
                        role="gridcell"
                        aria-colindex={colIdx + 1}
                        className="px-6 py-4 whitespace-nowrap text-sm"
                      >
                        {column.render
                          ? column.render(row[column.key])
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr role="row">
                <td
                  role="gridcell"
                  colSpan={columns.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
              {' '}-{' '}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>
              {' '}of{' '}
              <span className="font-medium">{sortedData.length}</span> results
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
                className="relative inline-flex items-center px-2 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                const pageNumber = currentPage <= 3
                  ? idx + 1
                  : currentPage >= totalPages - 2
                    ? totalPages - 4 + idx
                    : currentPage - 2 + idx;
                
                if (pageNumber <= 0 || pageNumber > totalPages) return null;
                
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(pageNumber)}
                    aria-label={`Go to page ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                    className={cn(
                      "relative inline-flex items-center px-3 py-1 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
                className="relative inline-flex items-center px-2 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
    {/* Screen reader announcements */}
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
    </>
  );
}

export default DataTable;
