import { useEffect, useState } from "react";
import loot from "../data/loot.json";
import { useManualQuery } from "graphql-hooks";
import { sort } from "fast-sort";
import { shortenAddress } from "@utils";
import useCurrentUser from "@hooks/useCurrentUser";
import eth from "../ethers";

const sortByPrice = bags =>
  sort(bags).asc(bag => (bag.isForSale ? bag.price : Infinity));

const WALLET_QUERY = ` query Wallet($id: ID!){
  wallet(id: $id) {
    id
    address
    bagsHeld
    bags {
    id
    currentOwner {
      address
      bagsHeld
    }
  }
  }
}`;

const useWallet = address => {
  const currentUser = useCurrentUser();
  const [wallet, setWallet] = useState({
    bagsHeld: 0,
    bags: []
  });
  const [fetchWallet] = useManualQuery(WALLET_QUERY);

  useEffect(() => {
    const getWallet = async () => {
      let response = await fetch("/api/prices");
      let prices = await response.json();

      const { data } = await fetchWallet({
        variables: { id: address.toLocaleLowerCase() }
      });

      let { bags } = data.wallet;

      let withPrices = bags.map(bag => {
        let price = prices[bag.id.toString()];
        let bagData = loot.find(b => b.id == bag.id);

        return {
          ...bag,
          ...bagData,
          isForSale: !!price,
          price: price ? price : 0
        };
      });

      setWallet({
        ...data.wallet,
        bags: sortByPrice(withPrices),
        shortName: shortenAddress(data.wallet.address)
      });
    };

    if (address) {
      getWallet();
    }
  }, [address]);

  useEffect(() => {
    const getEnsName = async () => {
      let ownerAddress = wallet.address;
      let ens = await eth.getEnsName(ownerAddress);
      let avatar = await eth.getAvatar(ens);

      setWallet({
        ...wallet,
        ownerAvatar: avatar,
        shortName: ens || shortenAddress(ownerAddress)
      });
    };

    if (currentUser && wallet.address) {
      getEnsName();
    }
  }, [currentUser, wallet.address]);

  return wallet;
};

export default useWallet;