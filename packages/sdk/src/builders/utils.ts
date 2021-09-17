import { BigNumber } from "@ethersproject/bignumber";
import { randomBytes } from "@ethersproject/random";

export const getListingTime = () =>
  // Set the listing time 5 minutes in the past to make sure
  // on-chain order validation passes (listing time is checked
  // to be less than the blockchain time).
  Math.floor(Date.now() / 1000) - 5 * 60;

export const getSalt = () => BigNumber.from(randomBytes(32));
