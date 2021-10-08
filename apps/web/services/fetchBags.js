import lootAPI from "./lootAPI";
import fetchPrices from "./fetchPrices";
export const BAGS_PER_PAGE = 25;
import { gweiToEth } from "@utils";

export const formatToken = token => {
  let id = Number(token.tokenId);

  return {
    ...token,
    isForSale: !!token.listingPrice,
    source: token.listingSource,
    price: token.listingSource ? gweiToEth(token.listingPrice) : 0,

    characterImage: `https://api.lootcharacter.com/imgs/bags/${(
      "0000" + id
    ).slice(-4)}.png`,
    id,
    image: `https://loot.exchange/images/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/${id}.svg`
  };
};

const removeEmpty = obj =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

const fetchBags = async ({
  offset = 0,
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

  let data = await lootAPI(`/tokens?${params}`);

  let formattedTokens = data.tokens.map(formatToken);
  let total = data.totalCount;

  return { bags: formattedTokens, total };
};

export default fetchBags;
