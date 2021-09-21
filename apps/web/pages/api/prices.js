import * as ethers from "ethers";
import fetch from "node-fetch";

const api = async (_req, res) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/collection/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/orders`
  );
  const json = await response.json();

  const tokenIdToPrice = {};
  const sellOrders = json.orders.sells;
  for (const sell of sellOrders) {
    const tokenId = Number(sell.tokenId);
    const price = Number(ethers.utils.formatEther(sell.basePrice));
    tokenIdToPrice[tokenId] = price;
  }

  res.status(200).json(tokenIdToPrice);
};

export default api;
