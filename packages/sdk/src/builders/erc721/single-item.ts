import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";

import OrderHelper from "../../helpers/order";
import { HowToCall, Order, Side, SaleKind } from "../../types";
import {
  bn,
  getDutchAuctionBuyTime,
  getDutchAuctionSellTime,
  getListingTime,
  getSalt,
} from "../utils";

import Erc721Abi from "../../abis/ERC721.json";

const REPLACEMENT_PATTERN_BUY =
  "0x00000000" + "f".repeat(64) + "0".repeat(64) + "0".repeat(64);
const REPLACEMENT_PATTERN_SELL =
  "0x00000000" + "0".repeat(64) + "f".repeat(64) + "0".repeat(64);

type RequiredOrderParams = {
  exchange: string;
  maker: string;
  target: string;
  tokenId: BigNumberish;
  paymentToken: string;
  basePrice: BigNumberish;
  fee: BigNumberish;
  feeRecipient: string;
  listingTime: BigNumberish;
  expirationTime: BigNumberish;
  salt: BigNumberish;
  extra?: BigNumberish;
  v?: number;
  r?: string;
  s?: string;
};

export default class SingleItemErc721OrderBuilder {
  // --------------- Public ---------------

  public static extractTokenId(order: Order): string | undefined {
    try {
      const result = new Interface(Erc721Abi as any).decodeFunctionData(
        "transferFrom",
        order.calldata
      );
      return result.tokenId.toString();
    } catch {
      return undefined;
    }
  }

  public static isSell(order: Order, tokenId: string): boolean {
    // Build a mock order that is for sure well-formatted
    const built = this.sell({
      ...order,
      tokenId,
      fee: 0,
    });

    // Make sure the built order's fields match the given order
    return (
      order.calldata === built.calldata &&
      order.replacementPattern === built.replacementPattern
    );
  }

  public static isBuy(order: Order, tokenId: string): boolean {
    // Build a mock order that is for sure well-formatted
    const built = this.buy({
      ...order,
      tokenId,
      fee: 0,
    });

    // Make sure the built order's fields match the given order
    return (
      order.calldata === built.calldata &&
      order.replacementPattern === built.replacementPattern
    );
  }

  public static sell(params: RequiredOrderParams): Order {
    if (bn(params.extra || 0).gt(0)) {
      if (bn(params.listingTime).gte(bn(params.expirationTime))) {
        throw new Error("Invalid listing/expiration time");
      }
    }

    return OrderHelper.normalize({
      exchange: params.exchange,
      maker: params.maker,
      taker: AddressZero,
      makerRelayerFee: params.fee,
      takerRelayerFee: 0,
      feeRecipient: params.feeRecipient,
      side: Side.SELL,
      saleKind: bn(params.extra || 0).gt(0)
        ? SaleKind.DUTCH_AUCTION
        : SaleKind.FIXED_PRICE,
      target: params.target,
      howToCall: HowToCall.CALL,
      calldata: new Interface(Erc721Abi as any).encodeFunctionData(
        "transferFrom",
        [params.maker, AddressZero, params.tokenId]
      ),
      replacementPattern: REPLACEMENT_PATTERN_SELL,
      staticTarget: AddressZero,
      staticExtradata: "0x",
      paymentToken: params.paymentToken,
      basePrice: params.basePrice,
      extra: params.extra || 0,
      listingTime: params.listingTime,
      expirationTime: params.expirationTime,
      salt: params.salt,
      v: params.v || 0,
      r:
        params.r ||
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      s:
        params.s ||
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    });
  }

  public static buy(params: RequiredOrderParams): Order {
    if (bn(params.extra || 0).gt(0)) {
      if (bn(params.listingTime).gte(bn(params.expirationTime))) {
        throw new Error("Invalid listing/expiration time");
      }
    }

    return OrderHelper.normalize({
      exchange: params.exchange,
      maker: params.maker,
      taker: AddressZero,
      makerRelayerFee: 0,
      takerRelayerFee: params.fee,
      feeRecipient: params.feeRecipient,
      side: Side.BUY,
      saleKind: bn(params.extra || 0).gt(0)
        ? SaleKind.DUTCH_AUCTION
        : SaleKind.FIXED_PRICE,
      target: params.target,
      howToCall: HowToCall.CALL,
      calldata: new Interface(Erc721Abi as any).encodeFunctionData(
        "transferFrom",
        [AddressZero, params.maker, params.tokenId]
      ),
      replacementPattern: REPLACEMENT_PATTERN_BUY,
      staticTarget: AddressZero,
      staticExtradata: "0x",
      paymentToken: params.paymentToken,
      basePrice: params.basePrice,
      extra: params.extra || 0,
      listingTime: params.listingTime,
      expirationTime: params.expirationTime,
      salt: params.salt,
      v: params.v || 0,
      r:
        params.r ||
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      s:
        params.s ||
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    });
  }

  public static matchingSell(seller: string, buyOrder: Order): Order {
    if (buyOrder.side !== Side.BUY) {
      throw new Error("Invalid buy order side");
    }
    if (buyOrder.replacementPattern !== REPLACEMENT_PATTERN_BUY) {
      throw new Error("Invalid buy order replacement pattern");
    }

    const buyCalldata = new Interface(Erc721Abi as any).decodeFunctionData(
      "transferFrom",
      buyOrder.calldata
    );

    // Make sure the buy order's calldata has the following format:
    // "transferFrom(address(0), buyer, tokenId)"
    if (buyCalldata.to.toLowerCase() !== buyOrder.maker.toLowerCase()) {
      throw new Error("Invalid buy order calldata");
    }
    if (buyCalldata.from !== AddressZero) {
      throw new Error("Invalid buy order calldata");
    }

    // As in https://github.com/ProjectWyvern/wyvern-ethereum/blob/bfca101b2407e4938398fccd8d1c485394db7e01/contracts/exchange/SaleKindInterface.sol#L70-L87
    const basePrice =
      buyOrder.saleKind === SaleKind.FIXED_PRICE
        ? bn(buyOrder.basePrice)
        : bn(buyOrder.basePrice).add(
            bn(buyOrder.extra)
              .mul(bn(getDutchAuctionBuyTime()).sub(bn(buyOrder.listingTime)))
              .div(bn(buyOrder.expirationTime).sub(bn(buyOrder.listingTime)))
          );

    return OrderHelper.normalize({
      exchange: buyOrder.exchange,
      maker: seller,
      taker: buyOrder.maker,
      makerRelayerFee: buyOrder.makerRelayerFee,
      takerRelayerFee: buyOrder.takerRelayerFee,
      feeRecipient: AddressZero,
      side: Side.SELL,
      saleKind: SaleKind.FIXED_PRICE,
      target: buyOrder.target,
      howToCall: HowToCall.CALL,
      calldata: new Interface(Erc721Abi as any).encodeFunctionData(
        "transferFrom",
        [seller, AddressZero, buyCalldata.tokenId]
      ),
      replacementPattern: REPLACEMENT_PATTERN_SELL,
      staticTarget: AddressZero,
      staticExtradata: "0x",
      paymentToken: buyOrder.paymentToken,
      basePrice,
      extra: 0,
      listingTime: getListingTime(),
      expirationTime: 0,
      salt: getSalt(),
      v: 0,
      r: "0x0000000000000000000000000000000000000000000000000000000000000000",
      s: "0x0000000000000000000000000000000000000000000000000000000000000000",
    });
  }

  public static matchingBuy(buyer: string, sellOrder: Order): Order {
    if (sellOrder.side !== Side.SELL) {
      throw new Error("Invalid sell order side");
    }
    if (sellOrder.replacementPattern !== REPLACEMENT_PATTERN_SELL) {
      throw new Error("Invalid sell order replacement pattern");
    }

    const sellCalldata = new Interface(Erc721Abi as any).decodeFunctionData(
      "transferFrom",
      sellOrder.calldata
    );

    // Make sure the sell order's calldata has the following format:
    // "transferFrom(seller, address(0), tokenId)"
    if (sellCalldata.from.toLowerCase() !== sellOrder.maker.toLowerCase()) {
      throw new Error("Invalid sell order calldata");
    }
    if (sellCalldata.to !== AddressZero) {
      throw new Error("Invalid sell order calldata");
    }

    // As in https://github.com/ProjectWyvern/wyvern-ethereum/blob/bfca101b2407e4938398fccd8d1c485394db7e01/contracts/exchange/SaleKindInterface.sol#L70-L87
    const basePrice =
      sellOrder.saleKind === SaleKind.FIXED_PRICE
        ? bn(sellOrder.basePrice)
        : bn(sellOrder.basePrice).sub(
            bn(sellOrder.extra)
              .mul(bn(getDutchAuctionSellTime()).sub(bn(sellOrder.listingTime)))
              .div(bn(sellOrder.expirationTime).sub(bn(sellOrder.listingTime)))
          );

    return OrderHelper.normalize({
      exchange: sellOrder.exchange,
      maker: buyer,
      taker: sellOrder.maker,
      makerRelayerFee: sellOrder.makerRelayerFee,
      takerRelayerFee: sellOrder.takerRelayerFee,
      feeRecipient: AddressZero,
      side: Side.BUY,
      saleKind: SaleKind.FIXED_PRICE,
      target: sellOrder.target,
      howToCall: HowToCall.CALL,
      calldata: new Interface(Erc721Abi as any).encodeFunctionData(
        "transferFrom",
        [AddressZero, buyer, sellCalldata.tokenId]
      ),
      replacementPattern: REPLACEMENT_PATTERN_BUY,
      staticTarget: AddressZero,
      staticExtradata: "0x",
      paymentToken: sellOrder.paymentToken,
      basePrice,
      extra: 0,
      listingTime: getListingTime(),
      expirationTime: 0,
      salt: getSalt(),
      v: 0,
      r: "0x0000000000000000000000000000000000000000000000000000000000000000",
      s: "0x0000000000000000000000000000000000000000000000000000000000000000",
    });
  }
}
