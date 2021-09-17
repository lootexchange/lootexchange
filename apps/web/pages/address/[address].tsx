import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from 'components/Layout'
import { useContext, useEffect } from 'react'
import { GlobalContext } from 'context/GlobalState'
import { OpenSeaAsset, OpenSeaCollection } from 'interfaces/openSea'
import Assets from 'components/Assets'
import { initWeb3 } from 'lib/web3'

type Props = {
  data: {
    openSeaCollection: OpenSeaCollection[]
  }
}

const NotFound = () => (
  <Layout title="No data">
    <p className="text-xl font-semibold text-center">
      No NFTs found for this address
    </p>
  </Layout>
)

const EOA = ({ data: { openSeaCollection } }: Props) => {
  const { state, dispatch } = useContext(GlobalContext)

  useEffect(() => initWeb3(dispatch), [])

  useEffect(() => {
    dispatch({ type: 'LOAD_OPENSEA', payload: openSeaCollection })
  }, [openSeaCollection])

  const router = useRouter()
  const { address } = router.query

  if (typeof address !== 'string') {
    return <NotFound />
  }

  if (!!openSeaCollection) {
    return (
      <Layout title="Address">
        <pre className="mb-4">Owner: {address}</pre>
        {state.openSeaCollection !== null && <Assets />}
      </Layout>
    )
  }

  return <NotFound />
}

export default EOA

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { address: '0x759c5f293edc487aa02186f0099864ebc53191c1' } },
    ],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({
  params: { address },
}) => {
  let res = await fetch(
    `https://api.opensea.io/api/v1/assets?owner=${
      typeof address === 'string' ? address : address[0]
    }&order_direction=desc&offset=0&limit=20`
  )

  const { assets } = (await res.json()) as { assets: OpenSeaAsset[] }

  const data = { openSeaCollection: assets }

  if (!assets) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data },
  }
}
