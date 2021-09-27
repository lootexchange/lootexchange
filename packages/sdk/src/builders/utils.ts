import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { randomBytes } from "@ethersproject/random";

export const getDutchAuctionSellTime = () =>
  // Allow 2 minutes to cover any on-chain discrepancies
  Math.floor(Date.now() / 1000) - 2 * 60;

export const getDutchAuctionBuyTime = () =>
  // Allow 2 minutes to cover any on-chain discrepancies
  Math.floor(Date.now() / 1000) + 2 * 60;

export const getListingTime = () =>
  // Set the listing time 5 minutes in the past to make sure
  // on-chain order validation passes (listing time is checked
  // to be less than the blockchain time).
  Math.floor(Date.now() / 1000) - 5 * 60;

export const getSalt = () => BigNumber.from(randomBytes(32));

export const bn = (value: BigNumberish) => BigNumber.from(value);
