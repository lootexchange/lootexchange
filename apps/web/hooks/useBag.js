import { useState, useEffect } from "react";
import { useManualQuery } from "graphql-hooks";
import eth from "../ethers";
import { shortenAddress, loot } from "@utils";
import useCurrentUser from "@hooks/useCurrentUser";
import { formatEther } from "ethers/lib/utils";

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
  const [owner, setOwner] = useState({});
  const [transfers, setTransfers] = useState([]);
  const [fetchedEns, setFetchedEns] = useState(false);
  const currentUser = useCurrentUser();

  const [fetchBag] = useManualQuery(BAG_QUERY);

  const getAttributeDetail = async (name) => {
    const response = await fetch(`/api/searchItems?q=${name}`);
    return response.json();
  }

  const getAttributes = async (attributes) => {
    const attributesPromises = [];
    const result = [];
    for (const attribute of attributes) {
      attributesPromises.push(getAttributeDetail(attribute.value));
    }
    const attributeWithIds = await Promise.all(attributesPromises);

    for (let i = 0; i < attributes.length; ++i) {
      result.push({
        key: attributes[i].key,
        value: attributes[i].value,
        id: attributeWithIds[i][0].id
      });
    }
    return result;
  }


  useEffect(() => {
    const getBag = async () => {
      let bagData = loot().find((b) => b.id == id);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/collections/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/tokens/${id}`
      );
      const token = await response.json().then((result) => result.data.token);
      token.attributes = await getAttributes(token.attributes);
      let price = Number(formatEther(token?.listingPrice || "0"));
      let source = token?.listingSource || null;
      let start = Number(token?.listingStart);
      let expiration = Number(token?.listingExpiration);
      let extra = Number(formatEther(token?.listingExtra || "0"));
      if (extra !== 0) {
        price =
          price -
          (extra * (Math.floor(Date.now() / 1000) + 120 - start)) /
            (expiration - start);
      }

      setBag({
        ...token,
        ...bagData,
        shortName: shortenAddress(token.owner),
        source: source,
        isForSale: price !== 0,
        price: Math.round(price * 10000) / 10000,
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
        variables: { id },
      });
      setTransfers(data.transfers);
    };

    if (bag) {
      getTransfers();
    }
  }, [bagId]);

  useEffect(() => {
    const getSellOrder = async () => {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/collections/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/tokens/${id}/orders`
      );
      let orders = await response.json();
      console.log(orders.data.orders[0]);
      if (orders.data && orders.data.orders) {
        setBag({
          ...bag,
          sellOrder: orders.data.orders[0],
        });
      }
    };

    if (bag) {
      getSellOrder();
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
        shortName: ens || shortenAddress(ownerAddress),
      });
    };

    if (currentUser && bag) {
      getEnsName();
    }
  }, [currentUser, bagId]);

  return {
    bag,
    transfers,
    owner,
  };
};

export default useBag;
