import api from "@api";
import fetchPrices from "./fetchPrices";
export const BAGS_PER_PAGE = 20;
import { gweiToEth } from "@utils";

export const formatToken = token => {
  let id = Number(token.token_id);

  return {
    ...token,
    id,
    tokenId: token.token_id,
    isForSale: !!token.floor_price,
    price: token.floor_price ? gweiToEth(token.floor_price) : 0
  };
};

const sortToParams = {
  priceLow: {
    sort_direction: "asc",
    sort_by: "floor_price"
  },

  priceHigh: {
    sort_direction: "desc",
    sort_by: "floor_price"
  },
  tokenId: {
    sort_direction: "asc",
    sort_by: "token_id"
  },
  greatness: {
    sort_by: "_Greatness",
    sort_direction: "desc"
  }
};

const removeEmpty = obj =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

const renameFilters = (filters = {}) =>
  Object.fromEntries(
    Object.entries(filters)
      .filter(([_, v]) => !!v)
      .map(([key, value]) => [`_${key}`, value])
  );

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
  console.log(filter);
  let params = new URLSearchParams(
    removeEmpty({
      owner: owner ? owner.toLowerCase() : null,
      offset: offset * limit,
      limit: limit,
      ...sortToParams[sort],
      ...renameFilters(filter)
    })
  ).toString();

  let data = await api(collection, `tokens?${params}`);

  let formattedTokens = data.tokens.map(formatToken);
  let total = data.totalCount;

  return { items: formattedTokens, total };
};

export default fetchBags;
