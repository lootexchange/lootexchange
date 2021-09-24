import { useEffect, useState } from "react";
import { useManualQuery } from "graphql-hooks";
import { sort } from "fast-sort";
import { shortenAddress, loot } from "@utils";
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
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/collections/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/listing-infos`
      );
      let prices = await response
        .json()
        .then(result => result.data.listingInfos);

      const { data } = await fetchWallet({
        variables: { id: address.toLocaleLowerCase() }
      });

      let { bags } = data.wallet;

      let allBags = loot();
      let withPrices = bags.map(bag => {
        let priceInfo = prices[bag.id.toString()];
        let bagData = allBags.find(b => b.id == bag.id);

        return {
          ...bag,
          ...bagData,
          isForSale: !!priceInfo,
          price: priceInfo ? Number(priceInfo.price) : 0
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
