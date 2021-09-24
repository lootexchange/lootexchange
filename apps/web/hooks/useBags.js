import { useEffect, useState } from "react";
import { loot } from "@utils";
import { sort } from "fast-sort";

const sortByPrice = bags =>
  sort(bags).asc(bag => (bag.isForSale ? bag.price : Infinity));

const sortByNumber = bags => sort(bags).asc(bag => bag.id);

const useBags = ({ sort, filter, ids }) => {
  const [bags, setBags] = useState(loot);
  const [filteredBags, setFilteredBags] = useState([]);

  useEffect(() => {
    const getPrices = async () => {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/collections/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/listing-infos`
      );
      let prices = await response
        .json()
        .then(result => result.data.listingInfos);

      let withPrices = bags.map(bag => {
        let priceInfo = prices[bag.id.toString()];

        return {
          ...bag,
          isForSale: !!priceInfo,
          price: priceInfo ? Number(priceInfo.price) : 0
        };
      });

      setBags(withPrices);
    };

    getPrices();
  }, []);

  useEffect(() => {
    let filtered = filter == "all" ? bags : bags.filter(b => b.isForSale);

    if (ids) {
      filtered = filtered.filter(b => ids.includes(b.id.toString()));
    }

    let sorted =
      sort == "number" ? sortByNumber(filtered) : sortByPrice(filtered);

    setFilteredBags(sorted);
  }, [sort, filter, bags, ids]);

  let floor = Math.min(...bags.filter(p => p.isForSale).map(p => p.price));
  let localFloor = Math.min(
    ...filteredBags.filter(p => p.isForSale).map(p => p.price)
  );

  return {
    bags: filteredBags,
    floor: floor === Infinity ? 0 : floor,
    localFloor: localFloor === Infinity ? 0 : localFloor
  };
};

export default useBags;
