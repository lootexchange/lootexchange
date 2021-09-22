import fetch from "node-fetch";

const api = async (_req, res) => {
  const response = await fetch(
    `https://api.coinbase.com/v2/exchange-rates?currency=ETH`
  );
  const json = await response.json();

  res.status(200).json(json);
};

export default api;
