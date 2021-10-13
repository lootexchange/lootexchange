import { useEffect, useState } from "react";
import fetchItems from "../services/fetchItems";
import { BAGS_PER_PAGE } from "../services/fetchBags";

const useItems = ({ collection, sort, filter, source, owner, skip, item }) => {
  const [items, setItems] = useState([]);
  const [floor, setFloor] = useState(0);
  const [total, setTotal] = useState(7800);
  const [moreLeft, setMoreLeft] = useState(true);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNextItems = async () => {
    setLoading(true);
    let { items: results, total } = await fetchItems({
      offset,
      collection,
      filter,
      item,
      sort,
      owner
    });

    setTotal(total);

    setMoreLeft(results.length === BAGS_PER_PAGE);

    let localFloor = Math.min(
      ...[...items, ...results]
        .filter(item => item.price)
        .map(item => item.price)
    );

    setFloor(localFloor);

    setItems([...items, ...results]);

    setOffset(offset + 1);
    setLoading(false);
  };

  useEffect(() => {
    if (offset == 0 && !skip && collection) {
      fetchNextItems();
    }
  }, [offset, skip, collection]);

  useEffect(() => {
    setItems([]);
    setOffset(0);
  }, [filter, owner, skip, item, sort]);

  return {
    fetchMore: fetchNextItems,
    items,
    moreLeft,
    floor,
    total,
    loading
  };
};

export default useItems;
