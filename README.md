# The Loot Exchange

[The Loot Exchange](https://loot.exchange) is a marketplace dedicated to the Loot Universe. It's built by the community, for the community. Contribution is strongly encouraged.

## Notable Features

- Community can decide on royalties, and where they go. Have your say in the poll (coming soon!)
- Designed for Loot. Includes UX touches like character art and rarity color-coding that general-purpose marketplaces lack
- Can support Loot-specific standards like Extensions and Synthetics
- Includes both Open Sea orders and native Loot Exchange orders. This helps to avoid fragmented liquidity
- Open API for fetching metadata and market information. No API keys required

## Progress

- [x] Front-End prototype
- [x] Metadata and Order APIs
- [x] SDK for signing and submitting orders
- [x] Support for original Loot Bags
- [ ] Selling UX
- [ ] Fully functional on Rinkeby
- [ ] Initial mainnet launch
- [ ] Support for More Loot and other derivatives
- [ ] Support for Extensions
- [ ] L2 / Multichain

## API Endpoints

Use the Base URL of [https://api.loot.exchange/](https://api.loot.exchange/) and the following endpoints:

- [collections](https://api.loot.exchange/collections) - get list of supported collections
- [collection/:address/info](https://api.loot.exchange/collection/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/info) - get full information about a collection
- [collection/:address/tokens](https://api.loot.exchange/collection/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/tokens?id=1&id=2) - get list of tokens in a collection
- [collection/:address/prices](https://api.loot.exchange/collection/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/prices) - compact list of items for sale
- [collection/:address/attributes](https://api.loot.exchange/collection/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/attributes) - compact list attributes, for filtering
- [collection/:address/metadata](https://api.loot.exchange/collection/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/metadata) - compact list metadata, for client-side rendering
- [collection/:address/token/:tokenId/info](https://api.loot.exchange/collection/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/token/3/info) - get info about a single token
- [collection/:address/token/:tokenId/orders](https://api.loot.exchange/collection/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/token/3/orders) - get orders for a single token

If you are planning to use the API, let us know so that we can cater to your use case.

## Project Structure

The project is still in active development, which means that things might change quickly (eg. structure, configuration). Proceed with caution.

This repository is structured as a Yarn 2 monorepo, consisting of the following packages:

- [`web`](./apps/web): web client
- [`sdk`](./packages/sdk): SDK for exchange interactions
- [`docs`](./apps/docs): API and SDK documentation (WIP)

Since this project is set up as a Yarn 2 monorepo, make sure to always use `yarn` instead of `npm`, otherwise some things might not work properly.

In the repository's root directory, run `yarn` to install all dependencies. Afterwards, specific package commands should be run in the corresponding package directory.


## Get Involved

- Participate in the poll to decide on Royalties
- Reach out in the #loot-marketplace-dev Discord channel 
