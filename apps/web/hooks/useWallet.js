import { useEffect, useState } from "react";
import { shortenAddress } from "@utils";
import useCurrentUser from "@hooks/useCurrentUser";
import eth from "../ethers";

const useWallet = address => {
  const [wallet, setWallet] = useState({
    shortName: ""
  });

  const currentUser = useCurrentUser();

  useEffect(() => {
    if (address) {
      setWallet({
        shortName: shortenAddress(address)
      });
    }
  }, [address]);

  useEffect(() => {
    const getEnsName = async () => {
      let ens = await eth.getEnsName(address);
      let avatar = await eth.getAvatar(ens);

      setWallet({
        ...wallet,
        ownerAvatar: avatar,
        shortName: ens || shortenAddress(address)
      });
    };

    if (currentUser && address) {
      getEnsName();
    }
  }, [currentUser, address]);

  return wallet;
};

export default useWallet;
