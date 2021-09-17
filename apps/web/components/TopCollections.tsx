import React, { useContext } from 'react'
import { GlobalContext } from 'context/GlobalState'
import Table from './Table'

const { format } = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function TopCollections() {
  const {
    state: { collections },
  } = useContext(GlobalContext)

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        id: 'seven_day_volume',
        Header: '7d Volume',
        accessor: (row) => row.stats.seven_day_volume,
        Cell: ({ row }) => `Ξ${format(row.values.seven_day_volume)}`,
      },
    ],
    []
  )

  const data = React.useMemo(
    () =>
      // collections
      //   .slice(0, 10)
      //   .sort((a, b) => b.stats.seven_day_volume - a.stats.seven_day_volume)
      [],
    []
  )

  return <Table columns={columns} data={data} />
}

export default TopCollections
