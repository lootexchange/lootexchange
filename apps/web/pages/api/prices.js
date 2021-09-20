// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetch from "node-fetch";

export default async (req, res) => {
  let response = await fetch(
    `${process.env.API_BASE}/collection/${process.env.LOOT_CONTRACT}/prices`
  );
  let json = await response.json();

  res.status(200).json(json);
};
