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


export const loot = () =>{
  let bags = []
  for(let i=1; i<=7779; i++) {
    bags.push({
        "characterImage": `https://api.lootcharacter.com/imgs/bags/${('0000'+i).slice(-4)}.png`,
        "id": i,
        "image": `https://townsquare.vercel.app/images/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/${i}.svg`,
        "name": `Bag #${i}`,
        "tokenId": i
    })
  }
  return bags
}
