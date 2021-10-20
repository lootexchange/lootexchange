import { useState, useEffect } from "react";
import useWallet from "@hooks/useWallet";
import fetchItem from "../services/fetchItem";
import useCurrentUser from "@hooks/useCurrentUser";

const useItem = (collection, id) => {
  const [item, setItem] = useState(null);
  let owner = useWallet(item && item.owner);
  const currentUser = useCurrentUser();

  if (item && currentUser) {
    owner.isOwnItem = item.owner === currentUser.address;
  }

  useEffect(() => {
    const getItem = async () => {
      let item = await fetchItem(collection, id);

      setItem(item);
    };

    if (id && collection) {
      getItem();
    }
  }, [collection, id]);

  return { item, owner };
};

export default useItem;
