import { useState, useEffect } from "react";
import { shortenAddress } from "@utils";

const useSynthLoot = address => {
  const [synthLoot, setSynthLoot] = useState(null);

  useEffect(() => {
    const fetchMetaData = async () => {
      let data = await fetch("/api/metadata/" + address).then(res =>
        res.json()
      );

      setSynthLoot({
        attributes: Object.keys(data.items).map(key => ({
          key: key[0].toUpperCase() + key.slice(1),
          value: data.items[key]
        })),
        name: "Bag " + shortenAddress(address),
        metadata: data
      });
    };

    if (address) {
      fetchMetaData();
    }
  }, [address]);

  return synthLoot;
};

export default useSynthLoot;
