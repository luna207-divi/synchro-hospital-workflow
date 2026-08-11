import React from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import './Table.css';

/**
 * Enterprise High-Density Table Component for Clinical Workflows
 */
export const Table = ({
  columns = [],
  data = [],
  sortColumn,
  sortDirection = 'asc',
  onSort,
  density = 'normal', // 'compact' | 'normal'
  emptyText = 'No records found',
  className = ''
}) => {
  return (
    <div className={`ot-table-container density-${density} ${className}`}>
      <table className="ot-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`${col.sortable ? 'is-sortable' : ''} ${col.align ? `align-${col.align}` : ''}`}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="th-content">
                  <span>{col.header}</span>
                  {col.sortable && (
                    <span className="th-sort-icon">
                      {sortColumn === col.key ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )
                      ) : (
                        <ArrowUpDown size={11} className="text-dim" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr key={row.id || rowIdx} className="ot-table-row">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${col.align ? `align-${col.align}` : ''} ${col.isMono ? 'font-mono' : ''}`}
                  >
                    {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="ot-table-empty">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
