import { GlobalContextType, State } from 'interfaces/context'
import React, { createContext, useReducer } from 'react'
import AppReducer from './AppReducer'

const initialState: State = {
  collections: null,
  openSeaCollection: null,
  asset: null,
  web3: {},
  filteredAttributes: [],
  data: {
    attributes: [],
    nfts: [],
  },
  filteredData: {
    attributes: [],
    nfts: [],
  },
  metadata: null,
  filteredMetadata: [],
}

export const GlobalContext = createContext<GlobalContextType>({
  state: initialState,
  dispatch: () => null,
})

export const GlobalProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState)

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}
