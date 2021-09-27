# The Loot Exchange

[The Loot Exchange](https://loot.exchange) is a marketplace dedicated to the Loot Universe. It's built by the community, for the community. Contribution is strongly encouraged. 

## Notable Features

- No platform fees 
  - All royalties (currently 1%) go to a treasury controlled by Loot token holders, to reinvest back into the community.
- Designed for Loot 
  - Includes UX touches like character art and rarity color-coding that general-purpose marketplaces lack. 
  - Can also support non-standard Loot features like Extensions and Synthetics
- Aggregated Order Book
  - Includes both Open Sea orders and native Loot Exchange orders. This helps to avoid fragmented liquidity
- Open API
  - Fetch metadata and market information. No API keys required.
- Battle-tested contracts
  - Leverages the same exchange contract as Open Sea (Wyvern), which minimizes risk
  - Anyone who has approved Open Sea for trading does not need to re-approve

## Progress

- [x] Core Front-End design
- [x] Metadata and Order APIs
- [x] SDK for signing and submitting orders
- [x] Support for original Loot Bags
- [x] Selling UX
- [x] Purchasing UX
- [x] Loot-specific rarity data
- [x] Community treasury for managing royalties
- [ ] Support for More Loot and other derivatives
- [ ] Support for Extensions
- [ ] Show which Loot derivatives
- [ ] Offers UX

For feature requests, create an Issue or join the Discord to discuss.

## RoyaltyDAO

A 1% royalty is collected on all trades, and sent to a community-operated treasury. The treasury is controlled by RoyaltyDAO, a fork of the [NounsDAO](https://github.com/nounsDAO/nouns-monorepo/tree/master/packages/nouns-contracts/contracts/governance), which implements Compound-style on-chain voting using Loot balances. Rather than trying to be "The DAO", this is simply "a DAO", with the sole purpose of collecting and allocating royalties. 

The DAO contract contains a small modification, to account for the fact that the Loot contract does not implement check-pointed balances. In order to prevent voting twice with the same tokens, each vote is tied to a particular token id. The main downside of this technique is that it is less efficient for large token holders to vote (requires multiple transactions), but the flipside is that this helps to democratize voting by taxing whales.


Instead, each vote is tied to a particular


## API Endpoints

Use the Base URL of [https://api.loot.exchange/](https://api.loot.exchange/) and the following endpoints:

- [/collections](https://api.loot.exchange/collections) - get list of supported collections
- [/collections/:address](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7) - get full information about a collection
- [/collections/:address/tokens](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/tokens) - get list of tokens in a collection
- [/collections/:address/listing-infos](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/listing-infos) - compact list of items for sale
- [/collections/:address/attributes](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/attributes) - compact list attributes, for filtering
- [/collections/:address/metadata](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/metadata) - compact list metadata, for client-side rendering
- [/collections/:address/tokens/:tokenId](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/tokens/3) - get info about a single token
- [/collections/:address/tokens/:tokenId/orders](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/tokens/3/orders) - get orders for a single token

The tokens API supports filters and pagination:

- [tokens](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/tokens) - all tokens, sorted by id
- [tokens?limit=20&offset=40](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/tokens?limit=20&offset=4) - pagination
- [tokens?id=10&id=11](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/tokens?id=1&id=2) - request specific tokens
- [tokens?forSale=true](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/tokens?forSale=true) - on sale items, sort by price
- [tokens?_weapon=Wand&_neck=Amulet](https://api.loot.exchange/collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/tokens?_weapon=Wand&_neck=Amulet) - filter by attribute

If you are planning to use the API, let us know so that we can cater to your use case.

## Project Structure and Setup

The project is still in active development, which means that things might change quickly (eg. structure, configuration). Proceed with caution.

This repository is structured as a Yarn 2 monorepo, consisting of the following packages:

- [`web`](./apps/web): web client
- [`docs`](./apps/docs): API and SDK documentation (WIP)
- [`sdk`](./packages/sdk): SDK for exchange interactions

Since this project is set up as a Yarn 2 monorepo, make sure to always use `yarn` instead of `npm`, otherwise some things might not work properly.

In the repository's root directory, run `yarn` to install all dependencies across all monorepo's packages. Afterwards, specific package commands should be run in the corresponding package directory.

The global commands `yarn deps:check` and `yarn deps:update` will help to maintain the same versions across the entire monorepo. After running `yarn deps:update`, a `yarn install` is required. To prevent having duplicates in the `yarn.lock`, you can run `yarn dedupe --check` and `yarn dedupe` to apply deduplication.

## Get Involved

- Participate in the poll to decide on Royalties
- Reach out in the #loot-marketplace-dev Discord channel
