import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";

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
};

export default config;
