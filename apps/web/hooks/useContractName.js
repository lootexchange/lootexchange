import { useRouter } from "next/router";

const nameToContractMap = {
  mloot: "0x1dfe7ca09e99d10835bf73044a23b73fc20623df",
  genesis: "0x8db687aceb92c66f013e1d614137238cc698fedb"
};

const useContractName = () => {
  const router = useRouter();
  const { contract } = router.query;

  return contract
    ? nameToContractMap[contract.toLowerCase()] || contract
    : null;
};

export default useContractName;
