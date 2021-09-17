import Layout from 'components/Layout'
import { GlobalContext } from 'context/GlobalState'
import { useContext, useEffect } from 'react'
import TopCollections from 'components/TopCollections'
import { initWeb3 } from 'lib/web3'
import search from 'public/data/search.json'

const IndexPage = () => {
  const { dispatch } = useContext(GlobalContext)

  useEffect(() => {
    // Ensure all elements have access to web3Modal
    initWeb3(dispatch)
    dispatch({ type: 'LOAD_COLLECTIONS', payload: search.collections })
  }, [])

  return (
    <Layout title="Loot Exchange Homepage">
      {/* {collections !== null && <TopCollections />} */}
    </Layout>
  )
}

export default IndexPage
