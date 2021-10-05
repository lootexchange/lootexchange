import { useEffect, useState } from "react";

// needs an end state
const useInfinteList = (items, number) => {
  const [list, setList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleScroll = () => {
    if (
      !isFetching &&
      !!items.length &&
      document.body.scrollHeight - window.innerHeight - window.scrollY <
        window.innerHeight
    ) {
      setIsFetching(true);
      setOffset(offset + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setList([...list, ...items.slice(offset * number, (offset + 1) * number)]);
    setIsFetching(false);
  }, [offset]);

  useEffect(() => {
    setOffset(0);
    setList([]);
    setList(items.slice(0, 0 + number));
  }, [items]);

  return list;
};

export default useInfinteList;
