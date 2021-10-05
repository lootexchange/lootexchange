import lootAPI from "./lootAPI";
import fetchPrices from "./fetchPrices";
const BAGS_PER_PAGE = 30;
import { gweiToEth } from "@utils";

export const formatToken = token => {
  let id = Number(token.tokenId);

  return {
    ...token,
    characterImage: `https://api.lootcharacter.com/imgs/bags/${(
      "0000" + id
    ).slice(-4)}.png`,
    id,
    image: `https://cdn-1a6d2.kxcdn.com/images/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/${i}`
  };
};

export const withPrice = (prices, token) => {
  let priceInfo = prices[token.id.toString()];

  return {
    ...token,
    isForSale: !!priceInfo,
    source: !!priceInfo ? priceInfo.source : null,
    price: priceInfo ? gweiToEth(priceInfo.price) : 0
  };
};

const removeEmpty = obj =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

const fetchBags = async ({
  offset = 0,
  source,
  sort,
  filter,
  owner,
  limit = BAGS_PER_PAGE
}) => {
  let params = new URLSearchParams(
    removeEmpty({
      owner: owner ? owner.toLowerCase() : null,
      offset: offset * limit,
      limit: limit,
      forSale: filter !== "all" ? true : null,
      source: filter == "LootExchange" || filter == "OpenSea" ? filter : null
    })
  ).toString();

  let [data, prices] = await Promise.all([
    lootAPI(`/tokens?${params}`),
    fetchPrices()
  ]);

  let formattedTokens = data.tokens.map(formatToken);
  let total = data.totalCount;

  let withPrices = formattedTokens.map(bag => withPrice(prices, bag));
  return { bags: withPrices, total };
};

export default fetchBags;
