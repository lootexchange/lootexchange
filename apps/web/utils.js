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

export const LOOT_API_URL = `${process.env.NEXT_PUBLIC_API_BASE}/collections/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}`;

export const getChainName = id => chainToName[id] || "Unknown";

export const formatEth = bigNumber =>
  parseFloat(parseFloat(ethers.utils.formatUnits(bigNumber)).toFixed(4));

export const loot = () => {
  let bags = [];
  for (let i = 1; i <= 7779; i++) {
    bags.push({
      characterImage: `https://api.lootcharacter.com/imgs/bags/${(
        "0000" + i
      ).slice(-4)}.png`,
      id: i,
      image: `https://cdn-1a6d2.kxcdn.com/images/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/${i}`,
      name: `Bag #${i}`,
      tokenId: i
    });
  }
  return bags;
};

export const abbreviateNumber = value => {
  let newValue = value;
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixNum = 0;

  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  newValue = parseFloat(newValue.toPrecision(3));

  newValue += suffixes[suffixNum];
  return newValue;
};

export const shortenNumber = (value, precision = 5) => {
  return parseFloat(value.toPrecision(precision));
};

export const gweiToEth = gwei => Number(ethers.utils.formatEther(gwei));

const positions = [
  "weapon",
  "chest",
  "head",
  "waist",
  "foot",
  "hand",
  "neck",
  "ring"
];

export const sortItems = items => {
  return items
    .slice()
    .filter(i => positions.indexOf(i.key) > -1)
    .sort(function(a, b) {
      return positions.indexOf(a.key) - positions.indexOf(b.key);
    });
};
