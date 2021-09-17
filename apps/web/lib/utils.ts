import supportedChains from './chains'
import { IChainData } from './types'

export function getChainData(chainId?: number): IChainData {
  if (!chainId) {
    return null
  }

  const chainData = supportedChains.find(({ chain_id }) => chain_id === chainId)

  if (!chainData) {
    throw new Error('The selected chain is not supported.')
  }

  return chainData
}
