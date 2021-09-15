import { BigNumberish } from "@ethersproject/bignumber";

export enum HowToCall {
  CALL,
  DELEGATE_CALL,
}

export enum SaleKind {
  FIXED_PRICE,
  DUTCH_AUCTION,
}

export enum Side {
  BUY,
  SELL,
}

export type Order = {
  exchange: string;
  maker: string;
  taker: string;
  makerRelayerFee: BigNumberish;
  takerRelayerFee: BigNumberish;
  feeRecipient: string;
  side: Side;
  saleKind: SaleKind;
  target: string;
  howToCall: HowToCall;
  calldata: string;
  replacementPattern: string;
  staticTarget: string;
  staticExtradata: string;
  paymentToken: string;
  basePrice: BigNumberish;
  extra: BigNumberish;
  listingTime: BigNumberish;
  expirationTime: BigNumberish;
  salt: BigNumberish;
  v: number;
  r: string;
  s: string;
};
