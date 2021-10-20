import { useRouter } from "next/router";

export const nameToContractMap = {
  mloot: "0x1dfe7ca09e99d10835bf73044a23b73fc20623df",
  genesis: "0x8db687aceb92c66f013e1d614137238cc698fedb",
  loot: process.env.NEXT_PUBLIC_LOOT_CONTRACT
};

const useContractName = () => {
  const router = useRouter();
  const { contract } = router.query;
  console.log(contract);

  let address = contract
    ? nameToContractMap[contract.toLowerCase()] || contract
    : null;

  return {
    readableName: contract,
    contract: address
  };
};

export default useContractName;
