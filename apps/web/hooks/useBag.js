import { useState, useEffect } from "react";
import useWallet from "@hooks/useWallet";
import fetchBag from "../services/fetchBag";
import useCurrentUser from "@hooks/useCurrentUser";

const useBag = id => {
  const [bag, setBag] = useState(null);
  let owner = useWallet(bag && bag.owner);
  const currentUser = useCurrentUser();
  if(bag && currentUser) {
    owner.isOwnBag = bag.owner === currentUser.address
  }

  useEffect(() => {
    const getBag = async () => {
      let bag = await fetchBag(id);

      setBag(bag);
    };

    if (id) {
      getBag();
    }
  }, [id]);

  return { bag, owner };
};

export default useBag;
