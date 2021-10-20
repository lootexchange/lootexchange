import api from "@api";
import fetchPrices from "./fetchPrices";
import { gweiToEth } from "@utils";

const formatToken = token => {
  let id = Number(token.tokenId);

  return {
    ...token,
    isForSale: !!token.listingPrice,
    source: token.listingSource,
    price: token.listingSource ? gweiToEth(token.listingPrice) : 0,
    image:
      token.image ||
      `https://loot.exchange/images/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/${id}.svg`,
    id
  };
};

const fetchItem = async (collection, id) => {
  let [data, orders] = await Promise.all([
    api(collection, `tokens/${id}`),
    api(collection, `tokens/${id}/orders`)
  ]);

  let formattedToken = formatToken(data.token);

  if (orders.orders.length) {
    let order = orders.orders[0];

    formattedToken = {
      ...formattedToken,
      sellOrder: order
    };
  }

  return formattedToken;
};
export default fetchItem;
