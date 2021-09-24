import { useEffect, useState } from "react";

const useItem = id => {
  const [item, setItem] = useState({});

  useEffect(() => {
    const getItem = async () => {
      let response = await fetch("/api/getBagIdsByItem?id=" + id);
      let result = await response.json();

      setItem(result);
    };

    if (id) {
      getItem();
    }
  }, [id]);

  return item;
};

export default useItem;
