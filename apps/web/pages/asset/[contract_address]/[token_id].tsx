import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from 'components/Layout'
import { useContext, useEffect } from 'react'
import { GlobalContext } from 'context/GlobalState'
import { Asset } from 'interfaces/openSea'
import Image from 'next/image'
import Link from 'next/link'
import Blockie from 'components/Blockie'
import { initWeb3 } from 'lib/web3'
import CollectionCard from 'components/CollectionCard'

type Props = {
  data: {
    // TODO: Find the correct type for asset
    asset: any
  }
}

const NotFound = () => (
  <Layout title="NFT does not exist.">
    <p className="text-xl font-semibold text-center">NFT does not exist.</p>
  </Layout>
)

const TokenId = ({ data: { asset } }: Props) => {
  const { dispatch } = useContext(GlobalContext)

  useEffect(() => initWeb3(dispatch), [])

  useEffect(() => {
    dispatch({ type: 'LOAD_ASSET', payload: asset })
  }, [asset])

  const router = useRouter()
  const { token_id } = router.query

  if (typeof token_id !== 'string') {
    return <NotFound />
  }

  const mockData = {
    title: 'Loot (for adventurers)',
    image: {
      url: '/placeholder.jpg',
      alt: "Loot's preview image.",
    },
    tags: ['Collection', '10,000 NFTs', '#5 Rank'],
    available: 4356,
    description:
      'Loot is randomized adventurer gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Loot in any way you want.',
    actions: [
      {
        name: 'Floor Price',
        value: 34.25,
        action: () => console.log('buy now'),
        buttonName: 'Buy Now',
      },
    ],
  }

  if (!!asset) {
    let { name, image_url } = asset
    return (
      <Layout title={name}>
        <article className="flex justify-between gap-3">
          <section>
            <CollectionCard {...mockData} />
          </section>
          <section>
            <Image
              src={image_url}
              alt={`${name}'s logo.`}
              width={500}
              height={500}
            />
          </section>
          <section>
            <button>Buy Now</button>
          </section>
        </article>
      </Layout>
    )
  }

  return <NotFound />
}

export default TokenId

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          contract_address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
          token_id: '1',
        },
      },
    ],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({
  params: { contract_address, token_id },
}) => {
  let res = await fetch(
    `https://api.opensea.io/api/v1/asset/${
      typeof contract_address === 'string'
        ? contract_address
        : contract_address[0]
    }/${typeof token_id === 'string' ? token_id : token_id[0]}/`
  )

  const asset = (await res.json()) as Asset

  const data = { asset }

  if (!asset) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data },
  }
}
