import fetch from "node-fetch";
import itemToPositionMap from "../../data/itemToPositionMap.json";

let API =
  process.env.NEXT_PUBLIC_CHAIN_ID === "4"
    ? "https://api.studio.thegraph.com/query/8490/loot-exchange--rinkeby/v0.0.3"
    : "https://api.studio.thegraph.com/query/8490/loot-market-lunar/0.0.2";

const api = async (req, res) => {
  let { id } = req.query;

  const ITEM_BAGS_QUERY = `{
    bags(first: 1000, where: { ${
      Object.values(itemToPositionMap)[id]
    }: "${Object.keys(itemToPositionMap)[id].replace(/"/g, '\\"')}" }) {
      id
    }
  }`;

  let response = await fetch(API, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      query: ITEM_BAGS_QUERY
    })
  });

  let result = await response.json();

  let ids = result.data.bags.map(bag => bag.id);

  res.status(200).json({
    ids,
    position: Object.values(itemToPositionMap)[id],
    count: ids.length,
    label: Object.keys(itemToPositionMap)[id]
  });
};

export default api;
