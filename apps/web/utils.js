export const shortenAddress = address => {
  return address.slice(0, 3) + "..." + address.slice(-4, -1);
};

export const formatMoney = money =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    money
  );
