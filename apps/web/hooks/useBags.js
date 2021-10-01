import { useEffect, useState } from "react";
import { loot } from "@utils";
import { sort } from "fast-sort";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

const sortByPrice = (bags) =>
  sort(bags).asc((bag) => (bag.isForSale ? bag.price : Infinity));

const sortByNumber = (bags) => sort(bags).asc((bag) => bag.id);

const bn = (value) => BigNumber.from(value);

const useBags = ({ sort, filter, marketplace, ids }) => {
  const [bags, setBags] = useState(loot);
  const [filteredBags, setFilteredBags] = useState([]);

  useEffect(() => {
    const getPrices = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/collections/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/listing-infos`
      );
      const listingInfos = await response
        .json()
        .then((result) => result.data.listingInfos);

      const bagsWithListingInfos = bags.map((bag) => {
        const listingInfoRaw = listingInfos[bag.id.toString()];
        const listingInfo = {
          price: Number(formatEther(listingInfoRaw?.price || "0")),
          source: listingInfoRaw?.source,
          start: Number(listingInfoRaw?.start),
          expiration: Number(listingInfoRaw?.expiration),
          extra: Number(formatEther(listingInfoRaw?.extra || "0")),
        };

        let price = listingInfo.price;
        if (listingInfo.extra !== 0) {
          price =
            price -
            (listingInfo.extra *
              (Math.floor(Date.now() / 1000) + 120 - listingInfo.start)) /
              (listingInfo.expiration - listingInfo.start);
        }

        return {
          ...bag,
          isForSale: price !== 0,
          source: listingInfo?.source || null,
          price: Math.round(price * 10000) / 10000,
        };
      });

      setBags(bagsWithListingInfos);
    };

    getPrices();
  }, []);

  useEffect(() => {
    let filtered =
      filter == "all"
        ? bags
        : filter == "forSale"
        ? bags.filter((b) => b.isForSale)
        : bags.filter((b) => filter === b.source);

    if (ids) {
      filtered = filtered.filter((b) => ids.includes(b.id.toString()));
    }

    let sorted =
      sort == "number" ? sortByNumber(filtered) : sortByPrice(filtered);

    setFilteredBags(sorted);
  }, [sort, filter, marketplace, bags, ids]);

  let floor = Math.min(...bags.filter((p) => p.isForSale).map((p) => p.price));
  let localFloor = Math.min(
    ...filteredBags.filter((p) => p.isForSale).map((p) => p.price)
  );

  return {
    bags: filteredBags,
    floor: floor === Infinity ? 0 : floor,
    localFloor: localFloor === Infinity ? 0 : localFloor,
  };
};

export default useBags;
