import { LOOT_API_URL } from "@utils";
const lootAPI = async (url, ...rest) => {
  let response = await fetch(`${LOOT_API_URL}${url}`, ...rest);
  let json = await response.json();
  return json.data;
};

export default lootAPI;
