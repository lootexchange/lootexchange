import { useState, useEffect } from "react";
import api from "@api";
import { formatToken } from "../services/fetchItems";

const useAddressTokens = address => {
  const [tokens, setTokens] = useState([]);
  useEffect(() => {
    const getTokens = async () => {
      let [loot, mLoot, genesis] = await Promise.all([
        api(address, "tokens" + "?collection_id=loot", "users"),
        api(address, "tokens" + "?collection_id=more-loot", "users"),
        api(address, "tokens" + "?collection_id=genesisadventurer", "users")
      ]);

      setTokens(
        [...loot.tokens, ...mLoot.tokens, ...genesis.tokens].map(formatToken)
      );
    };

    if (address) {
      getTokens();
    }
  }, [address]);

  return tokens;
};

export default useAddressTokens;
