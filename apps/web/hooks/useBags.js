import { useEffect, useState } from "react";
import loot from "../data/loot.json";
import { sort } from "fast-sort";

const sortByPrice = bags =>
  sort(bags).asc(bag => (bag.isForSale ? bag.price : Infinity));

const sortByNumber = bags => sort(bags).asc(bag => bag.id);

const useBags = ({ sort, filter }) => {
  const [bags, setBags] = useState(loot);
  const [filteredBags, setFilteredBags] = useState([]);

  useEffect(() => {
    const getPrices = async () => {
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/collection/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/prices`);
      let prices = await response.json();

      let withPrices = bags.map(bag => {
        let price = prices[bag.id.toString()];

        return {
          ...bag,
          isForSale: !!price,
          price: price ? price : 0
        };
      });

      setBags(withPrices);
    };

    getPrices();
  }, []);

  useEffect(() => {
    let filtered = filter == "all" ? bags : bags.filter(b => b.isForSale);
    let sorted =
      sort == "number" ? sortByNumber(filtered) : sortByPrice(filtered);

    setFilteredBags(sorted);
  }, [sort, filter, bags]);

  let floor = Math.min(...bags.filter(p => p.isForSale).map(p => p.price));

  return {
    bags: filteredBags,
    floor: floor === Infinity ? 0 : floor
  };
};

export default useBags;
