import { useState, useEffect } from "react";
import api from "@api";
import GenesisItem from "@ui/organisms/NFTs/Genesis";
import MLootItem from "@ui/organisms/NFTs/mLoot";
import LootItem from "@ui/organisms/NFTs/Loot";
import { gweiToEth } from "@utils";

const customCollectionData = {
  // genesis
  genesisadventurer: {
    cover:
      "https://lh3.googleusercontent.com/_oDa2m5z64Qf8RXbQFylP7MaDRwUXbJAchbDIFQqlVA8mdZ0feG4JHcMQwrYa7jTesY98RITIAfeAIGgHenvuMuU3zHmM15sRfTfQIE=h600",
    image: "/genesisCollectionLogo-medium.png",
    Item: GenesisItem,
    loot: true,
    royalty: 0.025,

    royaltyRecipient: {
      name: "Royalty",
      description: "Royalty goes to Genesis community treasury and founders",
      link: "https://genesisproject.xyz/"
    }
  },
  // mLoot
  "more-loot": {
    cover: "/community.png",

    image: "/mLootCollectionLogo-medium.png",
    Item: MLootItem,
    loot: true,
    hasItemSearch: true,
    royalty: 0,
    royaltyRecipient: {}
  },

  // Loot
  loot: {
    cover: "/community.png",

    image: "/lootCollectionLogo-medium.png",
    Item: LootItem,
    loot: true,
    hasItemSearch: true,
    royalty: 0.05,

    royaltyRecipient: {
      name: "Community Tresury",
      description:
        "Community controlled treasury for funding projects in the lootosphere.",
      link: "https://royaltydao.loot.exchange",
      address:
        process.env.NEXT_PUBLIC_CHAIN_ID == 4
          ? "0x8e71a0d2CC9c48173D9a9b7d90D6036093212aFa"
          : "0x8cFDF9E9f7EA8c0871025318407A6f1Fbc5d5a18"
    }
  }
};

const nameToContractMap = {};
const useCollection = id => {
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      let result = await api(id, "");

      setCollection({
        ...result.collection,
        floor: gweiToEth(result.collection.floor_price),
        count: result.collection.token_count,
        royalty: 0,
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
