import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import { connect } from 'components/ConnectWeb3'
import { Dispatch } from 'react'
import { Actions } from 'interfaces/context'

const providerOptions = {
  // Add walletconnect "plug-in"
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    },
  },
}

export function initWeb3(dispatch: Dispatch<Actions>) {
  let web3Modal: Web3Modal
  if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions,
    })
  }

  // Auto-connect from cached data
  if (web3Modal.cachedProvider) {
    connect(web3Modal, dispatch)
  }

  dispatch({ type: 'UPDATE_WEB3', payload: { web3Modal } })
}
