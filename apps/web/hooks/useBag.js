import * as ethers from "ethers";
import { useManualQuery } from "graphql-hooks";
import { useState, useEffect } from "react";

import eth from "@ethers";
import useCurrentUser from "@hooks/useCurrentUser";
import { shortenAddress } from "@utils";

import bags from "../data/loot.json";

const BAG_QUERY = `query BagQuery($id: ID!) {
  bag(id: $id) {
    id
    currentOwner {
      address
      bagsHeld
    }
  }

  transfers(where: { bag: $id }) {
    from{
      address
    }
    to {
      address
    }
    timestamp
    txHash
  }
}`;

const useBag = (id) => {
  const [bag, setBag] = useState(null);
  const [fetchedEns, setFetchedEns] = useState(false);
  const currentUser = useCurrentUser();

  const [fetchBag] = useManualQuery(BAG_QUERY);

  useEffect(() => {
    const getBag = async () => {
      const bagData = bags.find((b) => b.id == id);

      const { data } = await fetchBag({
        variables: { id },
      });

      const ownerAddress = data.bag.currentOwner.address;

      const orders = await fetch(`/api/orders?tokenId=${id}`).then((response) =>
        response.json()
      );

      // Sort the sell orders by base price
      const sellOrders = orders.orders.sells.sort((a, b) =>
        ethers.BigNumber.from(a.basePrice)
          .sub(ethers.BigNumber.from(b.basePrice))
          .lte(0)
          ? -1
          : 1
      );

      setBag({
        ...data.bag,
        ...bagData,
        shortName: shortenAddress(ownerAddress),
        isForSale: sellOrders.length !== 0,
        price:
          sellOrders.length !== 0
            ? Number(ethers.utils.formatEther(sellOrders[0].basePrice))
            : 0,
        transfers: data.transfers,
        sellOrder: sellOrders.length ? sellOrders[0] : null,
      });
    };

    if (id) {
      getBag();
    }
  }, [id]);

  useEffect(() => {
    const getEnsName = async () => {
      let ownerAddress = bag.currentOwner.address;
      let ens = await eth.getEnsName(ownerAddress);
      let avatar = await eth.getAvatar(ens);

      setFetchedEns(true);
      setBag({
        ...bag,
        ownerAvatar: avatar,
        shortName: ens || shortenAddress(ownerAddress),
      });
    };

    if (currentUser && bag && !fetchedEns) {
      getEnsName();
    }
  }, [currentUser, bag]);

  return bag;
};

export default useBag;
