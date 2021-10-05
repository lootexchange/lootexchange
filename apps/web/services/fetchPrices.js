import lootAPI from "./lootAPI";

const fetchPrices = async () => {
  let data = await lootAPI(`/listing-infos`);
  return data.listingInfos;
};

export default fetchPrices;
