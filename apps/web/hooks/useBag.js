import { useState, useEffect } from "react";
import useWallet from "@hooks/useWallet";
import fetchBag from "../services/fetchBag";

const useBag = id => {
  const [bag, setBag] = useState(null);
  const owner = useWallet(bag && bag.owner);

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
