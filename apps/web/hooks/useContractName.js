import { useRouter } from "next/router";

export const nameToContractMapOld = {
  "more-loot": "0x1dfe7ca09e99d10835bf73044a23b73fc20623df",
  genesisadventurer: "0x8db687aceb92c66f013e1d614137238cc698fedb",
  loot: process.env.NEXT_PUBLIC_LOOT_CONTRACT,
};

export const nameToContractMap = {
  "more-loot": {
    collection: "more-loot",
    contract: "0x1dfe7ca09e99d10835bf73044a23b73fc20623df",
  },
  genesisadventurer: {
    collection: "genesisadventurer",
    contract: "0x8db687aceb92c66f013e1d614137238cc698fedb",
  },

  loot: {
    collection: "loot",
    contract: process.env.NEXT_PUBLIC_LOOT_CONTRACT,
  },

  lootrealms: {
    collection: "lootrealms",
    contract: "0x7AFe30cB3E53dba6801aa0EA647A0EcEA7cBe18d",
  },

  lootexplorers: {
    collection: "lootexplorers",
    contract: "0x7AFe30cB3E53dba6801aa0EA647A0EcEA7cBe18d",
  },

  lootrings: {
    collection: "lootrings",
    contract: "0x7AFe30cB3E53dba6801aa0EA647A0EcEA7cBe18d",
  },

  "genesis-mana": {
    collection: "genesis-mana",
    contract: "0x7AFe30cB3E53dba6801aa0EA647A0EcEA7cBe18d",
  },
};

const useContractName = () => {
  const router = useRouter();
  const { contract } = router.query;

  let result = contract
    ? nameToContractMap[contract.toLowerCase()] || {
        collection: contract,
        contract,
      }
    : null;

  return {
    readableName: contract,
    ...result,
  };
};

export default useContractName;
