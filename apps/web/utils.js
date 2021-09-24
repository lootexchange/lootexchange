import { ethers } from "ethers";
export const shortenAddress = address => {
  return address.slice(0, 3) + "..." + address.slice(-3);
};

export const formatMoney = money =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    money
  );

export const chainToName = {
  1: "Mainnet",
  3: "Ropsten",
  5: "Goerli",
  4: "Rinkeby"
};

export const getChainName = id => chainToName[id] || "Unknown";

export const formatEth = bigNumber =>
  parseFloat(parseFloat(ethers.utils.formatUnits(bigNumber)).toFixed(4));
