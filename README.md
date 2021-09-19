# The Loot Exchange

[The Loot Exchange](https://loot.exchange) is a marketplace dedicated to the Loot Universe. It's built by the community, for the community. Contribution is strongly encouraged.

## Notable Features

- Community can decide on royalties, and where they go. Have your say in the poll here
- Designed for Loot. Includes UX touches like character art and rarity color-coding that general-purpose marketplaces lack
- Can support Loot-specific standards like Extensions and Synthetics
- Includes both Open Sea orders and native Loot Exchange orders. This helps to avoid fragmented liquidity

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

## Get Involved

- Participate in the poll to decide on Royalties
- Reach out in the #loot-marketplace-dev Discord channel 

## Project Structure

The project is still in active development, which means that things might change quickly (eg. structure, configuration). Proceed with caution.

This repository is structured as a Yarn 2 monorepo, consisting of the following packages:

- [`web`](./apps/web): web client
- [`sdk`](./packages/sdk): SDK for exchange interactions
- [`docs`](./apps/docs): API and SDK documentation (WIP)

Since this project is set up as a Yarn 2 monorepo, make sure to always use `yarn` instead of `npm`, otherwise some things might not work properly.

In the repository's root directory, run `yarn` to install all dependencies. Afterwards, specific package commands should be run in the corresponding package directory.
