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
  pageSize = 10
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
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ key, direction: 'desc' });
      } else if (sortConfig.direction === 'desc') {
        setSortConfig({ key: '', direction: null });
      } else {
        setSortConfig({ key, direction: 'asc' });
      }
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
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
    <div className={cn("bg-white border rounded-lg shadow-sm", className)}>
      {/* Header */}
      {(title || description || searchable || exportable) && (
        <div className="p-4 border-b">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              {title && <h3 className="text-lg font-medium">{title}</h3>}
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
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
                    className="h-9 rounded-md border border-gray-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              {exportable && (
                <button
                  onClick={handleExport}
                  className="h-9 px-3 rounded-md border border-gray-300 bg-white text-gray-700 flex items-center text-sm hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.sortable && "cursor-pointer hover:bg-gray-100"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && sortConfig.key === column.key && (
                      <span>
                        {sortConfig.direction === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : sortConfig.direction === 'desc' ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : null}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50">
                  {columns.map((column, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm">
                      {column.render
                        ? column.render(row[column.key])
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
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
                className="relative inline-flex items-center px-2 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
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
                    className={cn(
                      "relative inline-flex items-center px-3 py-1 border text-sm font-medium rounded-md",
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
                className="relative inline-flex items-center px-2 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
