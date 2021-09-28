import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";

import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.TESTING_ALCHEMY_KEY}`,
        blockNumber: Number(process.env.TESTING_BLOCK_NUMBER),
      },
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.DEPLOYMENT_INFURA_KEY}`,
      accounts: [process.env.DEPLOYMENT_PRIVATE_KEY || "0x00"],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: Boolean(process.env.REPORT_GAS),
    currency: "USD",
    gasPrice: 50,
    src: "contracts",
    coinmarketcap: "7643dfc7-a58f-46af-8314-2db32bdd18ba",
  },
  mocha: {
    timeout: 120000,
  },
};

export default config;
