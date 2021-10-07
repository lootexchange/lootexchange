import { useEffect, useState } from "react";
import fetchBags from "../services/fetchBags";

const useBags = ({ sort, filter, source, owner, skip, item }) => {
  const [bags, setBags] = useState([]);
  const [floor, setFloor] = useState(0);
  const [total, setTotal] = useState(7800);
  const [moreLeft, setMoreLeft] = useState(true);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNextBags = async () => {
    setLoading(true);
    let { bags: results, total } = await fetchBags({
      offset,
      filter,
      item,
      sort,
      owner
    });

    setTotal(total);

    setMoreLeft(results.length === 30);

    let localFloor = Math.min(
      ...[...bags, ...results].filter(bag => bag.price).map(bag => bag.price)
    );

    setFloor(localFloor);

    setBags([...bags, ...results]);

    setOffset(offset + 1);
    setLoading(false);
  };

  useEffect(() => {
    if (offset == 0 && !skip) {
      fetchNextBags();
    }
  }, [offset, skip]);

  useEffect(() => {
    setBags([]);
    setOffset(0);
  }, [filter, owner, skip, item, sort]);

  return {
    fetchMore: fetchNextBags,
    bags,
    moreLeft,
    floor,
    total,
    loading
  };
};

export default useBags;
