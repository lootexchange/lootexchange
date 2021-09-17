import Button from './Button'
import { GlobalContext } from 'context/GlobalState'
import { providers } from 'ethers'
import { Dispatch, Fragment, useContext, useEffect } from 'react'
import Web3Modal from 'web3modal'
import Blockie from './Blockie'
import { Actions, State } from 'interfaces/context'

export async function connect(
  web3Modal: Web3Modal,
  dispatch: Dispatch<Actions>
) {
  const provider = await web3Modal.connect()

  const web3Provider = new providers.Web3Provider(provider)

  const signer = web3Provider.getSigner()
  const address = await signer.getAddress()
  const { chainId } = await web3Provider.getNetwork()

  dispatch({
    type: 'UPDATE_WEB3',
    payload: {
      provider,
      web3Provider,
      address,
      chainId,
    },
  })
}

export async function disconnect(
  web3Modal: Web3Modal,
  provider: State['web3']['provider'],
  dispatch: Dispatch<Actions>
) {
  web3Modal.clearCachedProvider()
  if (provider?.disconnect && typeof provider.disconnect === 'function') {
    await provider.disconnect()
  }
  dispatch({ type: 'RESET_WEB3' })
}

const ConnectWeb3 = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const {
    web3: { address, web3Provider, provider, web3Modal },
  } = state

  // Listen to user events
  useEffect(() => {
    if (!!provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        // Apparently, Metamask does not emmit a disconnect event
        // when disconnecting an account, but instead emits an empty
        // accounts array. Use it to disconnect properly
        if (accounts.length === 0) {
          disconnect(web3Modal, provider, dispatch)
        } else {
          dispatch({ type: 'UPDATE_WEB3', payload: { address: accounts[0] } })
        }
      }

      const handleChainChanged = (chainId: string) =>
        dispatch({
          type: 'UPDATE_WEB3',
          payload: { chainId: parseInt(chainId, 16) },
        })

      const handleDisconnect = () => disconnect(web3Modal, provider, dispatch)

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider])
  return (
    <Fragment>
      {web3Provider ? (
        <Button
          onClick={async () => await disconnect(web3Modal, provider, dispatch)}
        >
          <Blockie address={address} />
        </Button>
      ) : (
        <Button onClick={() => connect(web3Modal, dispatch)}>
          Connect Wallet
        </Button>
      )}
    </Fragment>
  )
}

export default ConnectWeb3
