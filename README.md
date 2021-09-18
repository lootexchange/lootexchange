# Loot Exchange

Loot Exchange is a marketplace dedicated to the Loot universe. It's designed to be open and composable, so that anyone can build on top, or integrate it into their game.

It uses off-chain signed orders, similar to Open Sea, except the orders are stored to Polygon for data availability. Anyone can trustlessly use a subgraph or custom indexer to reconstruct the order book. Orders are settled using the Wyvern Exchange, exactly the same as Open Sea.

This design has the following advantages:

- Open and composable
- No new contracts to write or audit. Using the same contract that handles all Open Sea volume 
- Anyone who has approved for Open Sea trading does not need to re-approve
- The order book can aggregate both Open Sea and Loot.Exchange orders for complete liquidity
- Zero platform fees. Royalties can be directed to a community treasury (if one emerges)
- No API keys or rate limiting

### Structure

The project is still in active development, which means that things might change quickly (eg. structure, configuration). Proceed with caution.

This repository is structured as a Yarn 2 monorepo, consisting of the following packages:

- [`web`](./apps/web): web client
- [`sdk`](./packages/sdk): SDK for exchange interactions
- [`docs`](./apps/docs): API and SDK documentation (coming soon)

### Setup

Since this project is set up as a Yarn 2 monorepo, make sure to always use `yarn` instead of `npm`, otherwise some things might not work properly.

In the repository's root directory, run `yarn` to install all dependencies. Afterwards, specific package commands should be run in the corresponding package directory.
