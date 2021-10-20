import api from "@api";
import fetchPrices from "./fetchPrices";
export const BAGS_PER_PAGE = 25;
import { gweiToEth } from "@utils";

export const formatToken = token => {
  let id = Number(token.tokenId);

  return {
    ...token,
    id,
    isForSale: !!token.listingPrice,
    source: token.listingSource,
    price: token.listingSource ? gweiToEth(token.listingPrice) : 0
  };
};

const removeEmpty = obj =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

const fetchBags = async ({
  offset = 0,
  collection,
  source,
  sort,
  filter,
  item,
  owner,
  limit = BAGS_PER_PAGE
}) => {
  let params = new URLSearchParams(
    removeEmpty({
      owner: owner ? owner.toLowerCase() : null,
      offset: offset * limit,
      limit: limit,
      sort: sort == "Greatness" ? "_Greatness" : null,
      forSale: filter !== "all" ? true : null,
      source: filter == "LootExchange" || filter == "OpenSea" ? filter : null,
      ...(item && {
        [`_${item.key}`]: item.value
      })
    })
  ).toString();

  let data = await api(collection, `tokens?${params}`);

  let formattedTokens = data.tokens.map(formatToken);
  let total = data.totalCount;

  return { items: formattedTokens, total };
};

export default fetchBags;
