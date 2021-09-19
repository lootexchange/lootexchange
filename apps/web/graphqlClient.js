import { GraphQLClient } from "graphql-hooks";

const client = new GraphQLClient({
  // having trouble putting this into .env.local
  url: "https://api.studio.thegraph.com/query/8490/loot-market-lunar/0.0.2"
});

export default client;
