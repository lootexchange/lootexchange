import { useEffect, useState } from "react";

import GenesisItem from "@ui/organisms/NFTs/Genesis";
import LootItem from "@ui/organisms/NFTs/Loot";
import MLootItem from "@ui/organisms/NFTs/mLoot";
import AssetItem from "@ui/organisms/NFTs/Asset";
import api from "@api";
import { gweiToEth } from "@utils";

export const customCollectionData = {
  // Loot
  boredapeyachtclub: {
    image: "/byaclogotransparent.png",
    cover:
      "https://lh3.googleusercontent.com/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs=h600",
    royalty: 0.025,

    royaltyRecipient: {
      name: "Bored Ape Creators",
    },
    discord: "https://discord.com/invite/KuYyKXam9G",
    twitter: "https://twitter.com/lootproject",
    home: "https://lootproject.com",
    etherscan:
      "https://etherscan.io/address/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7",
  },

  // genesis
  genesisadventurer: {
    cover:
      "https://lh3.googleusercontent.com/_oDa2m5z64Qf8RXbQFylP7MaDRwUXbJAchbDIFQqlVA8mdZ0feG4JHcMQwrYa7jTesY98RITIAfeAIGgHenvuMuU3zHmM15sRfTfQIE=h600",

    filterPreference: ["Weapon", "Chest", "Order"],

    image: "/genesisCollectionLogo-medium.png",
    Item: GenesisItem,
    loot: true,
    royalty: 0.025,

    royaltyRecipient: {
      name: "Royalty",
      description: "Royalty goes to Genesis community treasury and founders",
      link: "https://genesisproject.xyz/",
      // FILL IN address: "",
    },

    discord: "https://discord.com/invite/YUYyPSuwfU",
    twitter: "https://twitter.com/genesisloot",
    home: "https://genesisproject.xyz",
    etherscan:
      "https://etherscan.io/token/0x8db687aceb92c66f013e1d614137238cc698fedb#writeProxyContract",
  },
  // mLoot
  "more-loot": {
    cover: "/community.png",

    filterPreference: ["Item"],
    image: "/mLootCollectionLogo-medium.png",
    Item: MLootItem,
    loot: true,
    hasItemSearch: true,
    royalty: 0,
    royaltyRecipient: {},
    discord: "https://discord.com/invite/KuYyKXam9G",
    twitter: "https://twitter.com/lootproject",
    home: "https://lootproject.com",
    etherscan:
      "https://etherscan.io/address/0x869ad3dfb0f9acb9094ba85228008981be6dbdde",
  },

  // Loot
  loot: {
    cover: "/community.png",

    filterPreference: ["Rarity", "Item"],

    image: "/lootCollectionLogo-medium.png",
    Item: LootItem,
    loot: true,
    hasItemSearch: true,
    royalty: 0.05,

    royaltyRecipient: {
      name: "Community Tresury",
      description:
        "Community controlled treasury for funding projects in the lootosphere.",
      link: "https://royaltydao.com",
      address:
        process.env.NEXT_PUBLIC_CHAIN_ID == 4
          ? "0x8e71a0d2CC9c48173D9a9b7d90D6036093212aFa"
          : "0x8cFDF9E9f7EA8c0871025318407A6f1Fbc5d5a18",
    },
    discord: "https://discord.com/invite/KuYyKXam9G",
    twitter: "https://twitter.com/lootproject",
    home: "https://lootproject.com",
    etherscan:
      "https://etherscan.io/address/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7",
  },

  // Genesis-Mana
  "genesis-mana": {
    cover:
      "https://lh3.googleusercontent.com/_oDa2m5z64Qf8RXbQFylP7MaDRwUXbJAchbDIFQqlVA8mdZ0feG4JHcMQwrYa7jTesY98RITIAfeAIGgHenvuMuU3zHmM15sRfTfQIE=h600",

    //filterPreference: ["Weapon", "Chest", "Order"],

    image: "/genesis_mana_icon.png",
    //Item: AssetItem,
    loot: true,
    //royalty: 0.025,

    royaltyRecipient: {
      name: "Royalty",
      description: "Royalty goes to Genesis community treasury and founders",
      link: "https://genesisproject.xyz/",
      // FILL IN address: "",
    },

    discord: "https://discord.com/invite/YUYyPSuwfU",
    twitter: "https://twitter.com/genesisloot",
    home: "https://genesisproject.xyz",
    etherscan:
      "https://etherscan.io/token/0xf4b6040a4b1b30f1d1691699a8f3bf957b03e463",
  },

  // Realms
  lootrealms: {
    cover: "/realms_header.svg",

    //filterPreference: ["Rarity", "Item"],

    image: "/realms_icon.png",
    //Item: GenericNFT,
    loot: true,
    hasItemSearch: true,
    //royalty: 0.05,

    royaltyRecipient: {
      name: "Loot Bibliotecha DAO",
      description:
        "Community controlled treasury for funding projects in the lootosphere.",
      link: "https://royaltydao.loot.exchange",
      //address:
    },
    discord: "https://discord.gg/P5Fm6mkf2g",
    twitter: "https://twitter.com/LootRealms",
    home: "https://bibliothecaforloot.com/",
    etherscan:
      "https://etherscan.io/address/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d",
  },

  // Rings
  "rings-for-loot": {
    cover: "/rings_header.png",

    //filterPreference: ["Rarity", "Item"],

    image: "/rings_icon.png",
    //Item: AssetItem,
    loot: true,
    hasItemSearch: true,
    //royalty: 0.05,

    royaltyRecipient: {
      name: "Rings DAO",
      description: "Royalty goes to the Rings DAO",
      //address: "0xE304d4e08D6C64A56EaFf976d8aB3AbdEdf867Ec",
      //link: "https://royaltydao.com",
    },
    discord: "https://discord.gg/3cxrS6FbTP",
    twitter: "https://twitter.com/RingsforLoot",
    home: "https://rings.market/",
    etherscan:
      "https://etherscan.io/address/0x73c5013fa9701425be4a436ca0cec1c0898e6f14#code",
  },

  // Loot Explorers
  "loot-explorer": {
    cover: "/lootexplorers_header.png",

    //filterPreference: ["Rarity", "Item"],

    image: "/lootexplorers_icon.png",
    Item: LootItem,
    loot: true,
    hasItemSearch: true,
    //royalty: 0.05,

    royaltyRecipient: {
      name: "Explorers DAO",
      //description: "Royalty goes to the Explorers DAO",
      address: "0xff632d1a9ee6a4109b521adb9503ffef0587b9aa",
    },
    discord: "https://discord.gg/tkKrY8kYJ4",
    twitter: "https://twitter.com/LootExplorers",
    home: "https://lootexplorers.quest/",
    etherscan:
      "https://etherscan.io/address/0x508d06b8f3a4b0fd363239ce61e0c4b0b82f3626",
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
        floor: gweiToEth(result.collection.floor_price),
        count: result.collection.token_count,
        royalty: 0,
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
