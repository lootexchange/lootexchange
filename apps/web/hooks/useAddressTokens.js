import { useState, useEffect } from "react";
import api from "@api";
import { formatToken } from "../services/fetchItems";

const useAddressTokens = address => {
  const [tokens, setTokens] = useState([]);
  useEffect(() => {
    const getTokens = async () => {
      let result = await api(address, "tokens", "users");

      setTokens(result.tokens.map(formatToken));
    };

    if (address) {
      getTokens();
    }
  }, [address]);

  return tokens;
};

export default useAddressTokens;
