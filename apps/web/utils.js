export const shortenAddress = address => {
  return address.slice(0, 3) + "..." + address.slice(-4, -1);
};
