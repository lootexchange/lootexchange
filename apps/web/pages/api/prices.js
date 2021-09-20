import fetch from "node-fetch";

const api = async (req, res) => {
  let response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/collection/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/prices`
  );
  let json = await response.json();

  res.status(200).json(json);
};

export default api;
