# Loot Exchange Monorepo

This repository contains the Loot Exchange web app and SDK.

### Structure

The project is still in active development, which means that things might change quickly (eg. structure, configuration). Proceed with caution.

This repository is structured as a Yarn 2 monorepo, consisting of the following packages:

- [`web`](./apps/web): web client
- [`sdk`](./packages/sdk): SDK for exchange interactions

### Setup

Since this project is set up as a Yarn 2 monorepo, make sure to always use `yarn` instead of `npm`, otherwise some things might not work properly.

In the repository's root directory, run `yarn` to install all dependencies. Afterwards, specific package commands should be run in the corresponding package directory.
