import { useState, useEffect } from "react";
import api from "@api";
import GenesisItem from "@ui/organisms/NFTs/Genesis";
import MLootItem from "@ui/organisms/NFTs/mLoot";
import LootItem from "@ui/organisms/NFTs/Loot";

const customCollectionData = {
  // genesis
  "0x8db687aceb92c66f013e1d614137238cc698fedb": {
    cover:
      "https://lh3.googleusercontent.com/_oDa2m5z64Qf8RXbQFylP7MaDRwUXbJAchbDIFQqlVA8mdZ0feG4JHcMQwrYa7jTesY98RITIAfeAIGgHenvuMuU3zHmM15sRfTfQIE=h600",
    image: "/genesisCollectionLogo-medium.png",
    Item: GenesisItem,
    loot: true
  },
  // mLoot
  "0x1dfe7ca09e99d10835bf73044a23b73fc20623df": {
    cover: "/community.png",

    image: "/mLootCollectionLogo-medium.png",
    Item: MLootItem,
    loot: true
  },

  // Loot
  [process.env.NEXT_PUBLIC_LOOT_CONTRACT]: {
    cover: "/community.png",

    image: "/lootCollectionLogo-medium.png",
    Item: LootItem,
    loot: true,
    hasItemSearch: true
  }
};

const nameToContractMap = {};
const useCollection = id => {
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      let result = await api(id, "");
      console.log(result);

      setCollection({
        ...result.collection,
        ...customCollectionData[id]
      });
    };

    if (id) {
      fetchCollection();
    }
  }, [id]);

  return collection;
};

export default useCollection;
