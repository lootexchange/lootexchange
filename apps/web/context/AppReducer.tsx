import { Actions, State } from 'interfaces/context'
import slugify from 'slugify'
import { matchSorter } from 'match-sorter'

const AppReducer = (state: State, action: Actions) => {
  switch (action.type) {
    // Load Rarity collections on page load
    case 'LOAD_COLLECTIONS':
      return { ...state, collections: action.payload }
    case 'LOAD_OPENSEA':
      return { ...state, openSeaCollection: action.payload }
    case 'LOAD_ASSET':
      return { ...state, asset: action.payload }
    case 'UPDATE_WEB3':
      return {
        ...state,
        web3: {
          ...state.web3,
          ...action.payload,
        },
      }
    case 'RESET_WEB3':
      // Clear everything, but the web3Modal
      return { ...state, web3: { web3Modal: state.web3.web3Modal } }
    case 'LOAD_DATA': {
      let filteredData = action.payload

      // Set the count for all traits to zero to start counting up
      filteredData.attributes.map((attribute) => {
        if (attribute.traits !== undefined) {
          attribute.traits.map((trait) => {
            trait.count = 0
            return trait
          })
          return attribute
        } else {
          return attribute
        }
      })

      // Update the count on all traits
      filteredData.nfts.forEach((nfts) =>
        nfts
          .slice(1)
          .forEach(
            (nft, idx) => filteredData.attributes[idx + 1].traits[+nft].count++
          )
      )

      return {
        ...state,
        data: action.payload,
        filteredData,
        // Generate array with all null values
        filteredAttributes: new Array(action.payload.attributes.length).fill(
          null
        ),
      }
    }
    case 'LOAD_METADATA': {
      let tokens = []
      for (let tokenId in action.payload.tokens) {
        let values = action.payload.tokens[tokenId]
        let token = { tokenId }
        values.forEach((value, i) => {
          token[action.payload.keys[i].key] =
            action.payload.keys[i].values[value]
          if (action.payload.keys[i].prefix) {
            token[action.payload.keys[i].key] =
              action.payload.keys[i].prefix + token[action.payload.keys[i].key]
          }
          if (action.payload.keys[i].tokenIdSuffix) {
            token[action.payload.keys[i].key] += tokenId
          }
        })
        tokens.push(token)
      }
      return {
        ...state,
        metadata: tokens,
        filteredMetadata: tokens,
      }
    }
    case 'APPLY_URL_FILTERS': {
      let attributes = state.filteredData.attributes
      let nfts = state.filteredData.nfts
      let filters = state.filteredAttributes

      let urlQueries = action.payload
      delete urlQueries.id

      // Convert the queries object into an array of its keys
      let keys = Object.keys(urlQueries)

      // Check if there is at least one filter
      if (keys.length > 0) {
        // Get the position in the filters' array
        let arrayPositions = keys.map((key) => [
          key,
          attributes.indexOf(attributes.find(({ name }) => name === key)),
        ])

        // Get the trait's position in the attributes array
        arrayPositions.forEach(
          ([name_, position]) =>
            (filters[position] = attributes[position].traits.indexOf(
              attributes[position].traits.find(
                ({ name }) => slugify(name) === slugify(urlQueries[name_])
              )
            ))
        )

        // Generate filteredItems array from the first filter
        filters.forEach((filter, idx) => {
          if (filter !== null) {
            nfts = nfts.filter((item) => item[idx] === filter)
            // Set last index to true to update UI
            attributes[idx].traits[filter].active = true
          }
        })

        // Set the count for all traits to zero to start counting up
        attributes.map((attribute) => {
          if (attribute.traits !== undefined) {
            attribute.traits.map((trait) => {
              trait.count = 0
              return trait
            })
            return attribute
          } else {
            return attribute
          }
        })

        // Update the count on all traits
        nfts.forEach((nfts) =>
          nfts
            .slice(1)
            .forEach((nft, idx) => attributes[idx + 1].traits[+nft].count++)
        )
      }
      return {
        ...state,
        filteredAttributes: filters,
        filteredData: {
          attributes,
          nfts,
        },
      }
    }
    case 'UPDATE_FILTERED_ASSETS': {
      let { attributeIndex, traitIndex } = action.payload
      let filters = state.filteredAttributes
      let attributes = state.filteredData.attributes
      let nfts = state.filteredData.nfts

      let currentItem = attributes[attributeIndex].traits[traitIndex]

      // Turn off filter
      if (filters[attributeIndex] === traitIndex) {
        // delete the filter
        filters[attributeIndex] = null

        // Set last index to false to update UI
        currentItem.active = false

        nfts = state.data.nfts

        // Generate filtered nfts array from the first filter
        filters.forEach((filter, idx) => {
          if (filter !== null) {
            nfts = nfts.filter((item) => item[idx] === filter)
          }
        })

        // Set the count for all traits to zero to start counting up
        attributes.map((attribute) => {
          if (attribute.traits !== undefined) {
            attribute.traits.map((trait) => {
              trait.count = 0
              return trait
            })
            return attribute
          } else {
            return attribute
          }
        })

        // Update the count on all traits
        nfts.forEach((nfts) =>
          nfts
            .slice(1)
            .forEach((nft, idx) => attributes[idx + 1].traits[+nft].count++)
        )
      } else {
        // add the filter
        filters[attributeIndex] = traitIndex

        // Generate filteredItems array from the first filter
        filters.forEach((filter, idx) => {
          if (filter !== null) {
            nfts = nfts.filter((item) => item[idx] === filter)
          }
        })

        // reset all values before updating. Only one item can be active
        attributes[attributeIndex].traits.forEach(
          (item) => (item.active = false)
        )

        // Set last index to true to update UI
        currentItem.active = true

        // Set the count for all traits to zero to start counting up
        attributes.map((attribute) => {
          if (attribute.traits !== undefined) {
            attribute.traits.map((trait) => {
              trait.count = 0
              return trait
            })
            return attribute
          } else {
            return attribute
          }
        })

        // Update the count on all traits
        nfts.forEach((nfts) =>
          nfts
            .slice(1)
            .forEach((nft, idx) => attributes[idx + 1].traits[+nft].count++)
        )
      }

      let filteredProperties = nfts.map((item) =>
        state.metadata.find(({ tokenId }) => tokenId === item[0])
      )

      return {
        ...state,
        filteredAttributes: filters,
        filteredProperties,
        filteredData: {
          attributes,
          nfts,
        },
      }
    }
    case 'FILTER_TRAIT': {
      const { searchValue, attributeIndex } = action.payload
      let attributes = JSON.parse(JSON.stringify(state.data.attributes))

      let searchResult = matchSorter(
        attributes[attributeIndex].traits,
        searchValue,
        {
          keys: ['name'],
        }
      )

      attributes[attributeIndex].traits = searchResult

      return {
        ...state,
        filteredData: {
          ...state.filteredData,
          attributes,
        },
      }
    }
    case 'FILTER_TABLE': {
      let filteredMetadata = matchSorter(state.metadata, action.payload, {
        keys: ['tokenId', 'name'],
      })

      return {
        ...state,
        filteredMetadata,
      }
    }
    default:
      return state
  }
}
export default AppReducer
