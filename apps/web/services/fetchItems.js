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
      sort_by: sort == "Greatness" ? "_Greatness" : null,
      sort_direction: sort === "Greatness" ? "desc" : "asc",
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
