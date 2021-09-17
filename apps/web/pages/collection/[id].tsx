import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from 'components/Layout'
import { Fragment, useContext, useEffect } from 'react'
import { GlobalContext } from 'context/GlobalState'
import { initWeb3 } from 'lib/web3'
import Roulette from 'components/Roulette'
import CollectionCard from 'components/CollectionCard'
import Assets from 'components/Assets'
import search from 'public/data/search.json'
import { TCollection } from 'interfaces/apis'
import { processRarityData } from 'lib/processApiData'
import Sidebar from 'components/Sidebar'
import TableSearch from 'components/TableSearch'

type Props = {
  collection: TCollection
}

const NotFound = () => (
  <Layout title="Collection not found">
    <p className="text-xl font-semibold text-center">
      There was an error loading this page.
    </p>
  </Layout>
)

const { collections } = search

const Collection = ({ collection }: Props) => {
  const { dispatch } = useContext(GlobalContext)
  const router = useRouter()
  const { id } = router.query

  // Initialize Wallet/Web3
  useEffect(() => initWeb3(dispatch), [])

  useEffect(() => {
    // Load the data used in the search bar
    dispatch({ type: 'LOAD_COLLECTIONS', payload: collections })
  }, [collections])

  if (!collection) return <NotFound />

  useEffect(() => {
    async function fetchAllData() {
      let res = await fetch(
        `https://api.loot.exchange/metadata?contract=${id}`
      )
      let metadata = await res.json()
      if (metadata) {
        dispatch({ type: 'LOAD_METADATA', payload: metadata })
      }

      res = await fetch(
        `https://api.loot.exchange/oldattributes?contract=${id}`
      )
      let attributes = await res.json()

      if (attributes) {
        dispatch({ type: 'LOAD_DATA', payload: processRarityData(attributes) })
        dispatch({ type: 'APPLY_URL_FILTERS', payload: router.query })
      }
    }

    if (id) {
      fetchAllData()
    }
  }, [id])

  const { name, image_url, description } = collection

  const mockData = {
    title: name,
    image: {
      url: image_url,
      alt: `${name}'s preview image.`,
    },
    tags: ['Collection', '10,000 NFTs', '#5 Rank'],
    available: 4356,
    description,
    actions: [
      {
        name: 'Floor Price',
        value: 34.25,
        action: () => console.log('buy now'),
        buttonName: 'Buy Now',
      },
    ],
  }

  return (
    <Fragment>
      <div className="flex">
        <div className="w-60 h-screen flex-none">
          <Sidebar />
        </div>
        <div className="flex-grow">
          <Layout title={name}>
            <section className="mb-4 mt-6 flex flex-col md:flex-row gap-3 items-center">
              <Roulette />
              <CollectionCard {...mockData} />
            </section>
            <TableSearch />
            <Assets />
          </Layout>
        </div>
      </div>
    </Fragment>
  )
}

export default Collection

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate a subset of the available collections
  // const ids = collections.slice(0, 1).map(({ id }) => id)

  // const paths = ids.map((id) => ({ params: { id } }))

  // LOOT
  // 0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7

  const paths = [
    { params: { id: '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7' } },
  ]

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params: { id } }) => {
  let res = await fetch(
    `https://api.loot.exchange/info?contract=${id}`
  )

  const collection = await res.json()

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: { collection },
  }
}
