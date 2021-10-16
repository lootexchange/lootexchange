import { useState, useEffect } from "react";
import api from "@api";

const defaultData = {
  cover: "/community.png",
};

const customCollectionData = {
  // genesis
  "0x8db687aceb92c66f013e1d614137238cc698fedb": {
    cover:
      "https://lh3.googleusercontent.com/_oDa2m5z64Qf8RXbQFylP7MaDRwUXbJAchbDIFQqlVA8mdZ0feG4JHcMQwrYa7jTesY98RITIAfeAIGgHenvuMuU3zHmM15sRfTfQIE=h600",
    image: "/genesisCollectionLogo.png",
    discord: "https://discord.com/invite/YUYyPSuwfU",
    twitter: "https://twitter.com/genesisloot",
    home: "https://genesisproject.xyz",
    etherscan:
      "https://etherscan.io/token/0x8db687aceb92c66f013e1d614137238cc698fedb#writeProxyContract",
  },
  // mLoot
  "0x1dfe7ca09e99d10835bf73044a23b73fc20623df": {
    image: "/mLootCollectionLogo.png",
  },
};

const nameToContractMap = {};
const useCollection = (id) => {
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      let result = await api(id, "");

      setCollection({
        ...result.collection,
        ...defaultData,
        ...customCollectionData[id],
      });
    };

    if (id) {
      fetchCollection();
    }
  }, [id]);

  return collection;
};

export default useCollection;
