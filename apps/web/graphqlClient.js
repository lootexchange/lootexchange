import { GraphQLClient } from "graphql-hooks";

let config;
if(process.env.CHAIN_ID=='1') {
  config = {
    url: "https://api.studio.thegraph.com/query/8490/loot-market-lunar/0.0.2"
  }
} else {
  config = {
    url: "https://api.studio.thegraph.com/query/8490/loot-exchange--rinkeby/v0.0.3"
  }
}
const client = new GraphQLClient(config);

export default client;
