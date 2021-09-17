import React, { useContext } from 'react'
import Image from 'next/image'
import { GlobalContext } from 'context/GlobalState'
import Table from './Table'
import Link from 'next/link'
import { formatEther } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'

function truncateString(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength - 1)}…`
  }
  return text
}

function Assets() {
  const {
    state: { filteredMetadata },
  } = useContext(GlobalContext)

  const columns = React.useMemo(
    () => [
      {
        id: 'thumbnail',
        Header: 'Thumb.',
        disableSortBy: true,
        accessor: ({ image }) => image,
        Cell: ({
          row: {
            original: { image, name },
          },
        }) => (
          <div className="relative h-10">
            {!!image && (
              <Image
                src={image}
                alt={`${name}'s image.`}
                layout="fill"
                objectFit="contain"
              />
            )}
          </div>
        ),
      },
      {
        Header: 'Name',
        accessor: ({ name }) => <p>{name}</p>,
      },
      {
        id: 'tokenId',
        Header: () => <p className="whitespace-nowrap">Token ID</p>,
        accessor: ({ tokenId }) => tokenId,
        Cell: ({
          row: {
            original: { tokenId },
          },
        }) => {
          return (
            <Link
              href={`/asset/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/${tokenId}`}
            >
              <a className="hover:underline">{truncateString(tokenId, 8)}</a>
            </Link>
          )
        },
      },
      {
        id: 'price',
        Header: 'Price',
        accessor: ({ price }) => (!!price ? price : null),
        Cell: ({
          row: {
            original: { price },
          },
        }) => {
          if (!!price) {
            return <p>Ξ{price}</p>
          }
          return <p>NULL</p>
        },
      },
      {
        Header: 'Listing',
        accessor: ({ listing }) => <p>{listing ? listing : 'NULL'}</p>,
      },
    ],
    []
  )

  if (filteredMetadata !== null) {
    return <Table columns={columns} data={filteredMetadata} />
  }

  return null
}

export default Assets
