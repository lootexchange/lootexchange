import { useState, useEffect } from "react";

const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState(0);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      let response = await fetch("/api/exchangeRate");
      let json = await response.json();
      setExchangeRate(json.data.rates.USD);
    };

    fetchExchangeRate();
  }, []);

  return exchangeRate;
};

export default useExchangeRate;
