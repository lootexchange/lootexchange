import lootAPI from "./lootAPI";
import fetchPrices from "./fetchPrices";
import { formatToken, withPrice } from "./fetchBags";

const fetchBag = async id => {
  let [data, orders] = await Promise.all([
    lootAPI(`/tokens/${id}`),
    lootAPI(`/tokens/${id}/orders`)
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

export default fetchBag;
