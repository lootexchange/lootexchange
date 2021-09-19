// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetch from "node-fetch";

export default async (req, res) => {
  let response = await fetch(
    "https://api.loot.exchange/prices?contract=0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7"
  );
  let json = await response.json();

  res.status(200).json(json);
};
