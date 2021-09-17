import { GlobalContext } from 'context/GlobalState'
import React, { useContext, useState } from 'react'

const TableSearch = () => {
  const { dispatch } = useContext(GlobalContext)
  const [query, setQuery] = useState('')

  return (
    <input
      className="px-2 mb-3 h-7 transition bg-transparent focus:shadow focus:outline-none rounded ring-1 ring-trueGray-300 dark:ring-trueGray-700 focus:ring-trueGray-400 focus:dark:ring-trueGray-500 focus:bg-trueGray-50 focus:dark:bg-trueGray-900"
      type="search"
      autoComplete="off"
      id="search"
      value={query}
      placeholder="Search tokens..."
      name="search"
      onChange={(e) => {
        setQuery(e.target.value)
        dispatch({ type: 'FILTER_TABLE', payload: e.target.value })
      }}
    />
  )
}
export default TableSearch
