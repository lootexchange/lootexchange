import { useState, useEffect } from "react";
import { useManualQuery } from "graphql-hooks";
import eth from "../ethers";
import { shortenAddress, loot } from "@utils";
import useCurrentUser from "@hooks/useCurrentUser";

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

const useBag = id => {
  const [bag, setBag] = useState(null);
  const [owner, setOwner] = useState({});
  const [transfers, setTransfers] = useState([]);
  const [fetchedEns, setFetchedEns] = useState(false);
  const currentUser = useCurrentUser();

  const [fetchBag] = useManualQuery(BAG_QUERY);

  useEffect(() => {
    const getBag = async () => {
      let bagData = loot().find(b => b.id == id);

      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/collection/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/token/${id}/info`
      );
      let token = await response.json();

      setBag({
        ...token.data.token,
        ...bagData,
        shortName: shortenAddress(token.data.token.owner),
        isForSale: !!token.data.token.listingPrice,
        price: token.data.token.listingPrice
      });
    };

    if (id) {
      getBag();
    }
  }, [id]);
  const bagId = bag && bag.id;

  useEffect(() => {
    const getTransfers = async () => {
      const { data } = await fetchBag({
        variables: { id }
      });
      setTransfers(data.transfers);
    };

    if (bag) {
      getTransfers();
    }
  }, [bagId]);

  useEffect(() => {
    const getEnsName = async () => {
      let ownerAddress = bag.owner;
      let ens = await eth.getEnsName(ownerAddress);
      let avatar = await eth.getAvatar(ens);

      setOwner({
        ...bag,
        isOwnBag: ownerAddress === currentUser.address,
        ownerAvatar: avatar,
        shortName: ens || shortenAddress(ownerAddress)
      });
    };

    if (currentUser && bag) {
      getEnsName();
    }
  }, [currentUser, bagId]);

  return {
    bag,
    transfers,
    owner
  };
};

export default useBag;
