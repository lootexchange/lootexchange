import React from 'react'
import { Asset, OpenSeaAsset } from './openSea'
import Web3Modal from 'web3modal'

export type GlobalContextType = {
  state: State
  dispatch: React.Dispatch<Actions>
}

type IAttributes = {
  name: string
  traits: { name: string; count: number; active: boolean }[]
}[]

type INfts = (string | number)[][]

type RarityData = {
  attributes: IAttributes
  nfts: INfts
}

type Metadata = any

export interface IWeb3 {
  address?: string
  chainId?: number
  provider?: any
  web3Provider?: any
  web3Modal?: Web3Modal
}

export type Collections = {
  id: string
  name: string
  image_url?: string
  address: string
}[]

export type State = {
  collections: Collections | null
  openSeaCollection: OpenSeaAsset[] | null
  asset: Asset | null
  web3: IWeb3
  filteredAttributes: (number | null)[]
  data: RarityData
  filteredData: RarityData
  metadata: Metadata | null
  filteredMetadata: Metadata
}

export type Actions = {
  type:
    | 'LOAD_COLLECTIONS'
    | 'LOAD_OPENSEA'
    | 'LOAD_ASSET'
    | 'UPDATE_WEB3'
    | 'RESET_WEB3'
    | 'UPDATE_FILTERED_ASSETS'
    | 'UPDATE_BASE_PROP_DEFS'
    | 'LOAD_DATA'
    | 'FILTER_ITEMS'
    | 'APPLY_URL_FILTERS'
    | 'FILTER_TRAIT'
    | 'FILTER_TABLE'
    | 'LOAD_METADATA'
  payload?: any
}
