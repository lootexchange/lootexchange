import { useEffect, useState } from "react";

import api from "@api";
import { formatToken } from "../services/fetchItems";

const useAddressTokens = (address, collection) => {
  const [tokens, setTokens] = useState([]);
  useEffect(() => {
    const getTokens = async () => {
      let [loot, mLoot, genesis] = await Promise.all([
        api(address, "tokens", "users")
      ]);

      setTokens([...loot.tokens].map(formatToken));

      false &&
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
