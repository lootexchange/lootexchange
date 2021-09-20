import { GraphQLClient } from "graphql-hooks";

const config = {
  url:
    process.env.NEXT_PUBLIC_CHAIN_ID === "4"
      ? "https://api.studio.thegraph.com/query/8490/loot-exchange--rinkeby/v0.0.3"
      : "https://api.studio.thegraph.com/query/8490/loot-market-lunar/0.0.2",
};
const client = new GraphQLClient(config);

export default client;
