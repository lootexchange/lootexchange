import { useState, useEffect } from "react";
import useExchangeRate from "./useExchangeRate";
import eth from "@ethers";
const useTreasuryBalance = () => {
  const [balance, setBalance] = useState(0);
  const exchangeRate = useExchangeRate();

  useEffect(() => {
    console.log(eth);
  }, []);

  return {
    balance,
    balanceUSD: exchangeRate ? balance * exchangeRate : 0
  };
};
