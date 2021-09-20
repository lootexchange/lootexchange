import fetch from "node-fetch";

export default async (req, res) => {
  const tokenId = req.query.tokenId;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/collection/${process.env.NEXT_PUBLIC_LOOT_CONTRACT}/token/${tokenId}/orders`
  );
  const json = await response.json();

  res.status(200).json(json);
};
