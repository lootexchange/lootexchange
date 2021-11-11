import api from "@api";
import fetchPrices from "./fetchPrices";
import { gweiToEth } from "@utils";

const formatToken = token => {
  let id = Number(token.token_id);

  return {
    ...token,
    isForSale: !!token.floor_price,
    price: token.floor_price ? gweiToEth(token.floor_price) : 0,
    image: token.image,
    id
  };
};

const fetchItem = async (collection, id) => {
  let [data, orders, owners, attributes] = await Promise.all([
    api(collection, `tokens/${id}`, "contracts"),
    api(collection, `tokens/${id}/orders`, "contracts"),
    api(collection, `tokens/${id}/owners`, "contracts"),
    api(collection, `tokens/${id}/attributes`, "contracts")
  ]);

  let formattedToken = formatToken({
    ...data.token,
    source:
      orders &&
      orders.orders.length &&
      orders.orders[0] &&
      orders.orders[0].custom_data.feeRecipient ==
        "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073"
        ? "OpenSea"
        : "LootExchange",
    owner: owners.owners[0].owner,
    attributes: attributes.attributes
  });

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
