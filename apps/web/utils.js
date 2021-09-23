export const shortenAddress = address => {
  return address.slice(0, 3) + "..." + address.slice(-3);
};

export const formatMoney = money =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    money
  );
