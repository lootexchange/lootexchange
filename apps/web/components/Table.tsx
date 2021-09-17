import React from 'react'
import { useSortBy, useTable, usePagination } from 'react-table'
import { HiSortAscending, HiSortDescending } from 'react-icons/hi'
import {
  ChevronRightIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
} from '@heroicons/react/solid'

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    prepareRow,
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    usePagination
  )

  // Render the UI for your table
  return (
    <>
      <table
        className="table-auto mb-2 ring-1 ring-trueGray-300 dark:ring-trueGray-900 rounded"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              className="border-b border-trueGray-300 dark:border-trueGray-900"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                // There is an issue with the types. It works well, but TypeScript throws an error.
                // https://github.com/tannerlinsley/react-table/issues/1481
                <th
                  className={`${
                    column.id === 'Name' ? 'w-full' : ''
                  } px-3 py-2 border-r border-trueGray-300 dark:border-trueGray-900 last:border-none`}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <div className="flex gap-1 items-center">
                    {column.render('Header')}
                    {/* @ts-ignore */}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <HiSortDescending className="w-6 h-6" />
                      ) : (
                        <HiSortAscending className="w-6 h-6" />
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr
                className="even:bg-trueGray-200 even:dark:bg-trueGray-900"
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => {
                  return (
                    <td className="px-3 py-2" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex gap-1 items-center">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          <ChevronDoubleLeftIcon className="w-5 h-5 text-trueGray-500 dark:text-trueGray-400" />
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          <ChevronLeftIcon className="w-5 h-5 text-trueGray-500 dark:text-trueGray-400" />
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          <ChevronRightIcon className="w-5 h-5 text-trueGray-500 dark:text-trueGray-400" />
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          <ChevronDoubleRightIcon className="w-5 h-5 text-trueGray-500 dark:text-trueGray-400" />
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            className="bg-trueGray-900"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          className="bg-trueGray-800"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option className="bg-trueGray-800" key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export default Table
