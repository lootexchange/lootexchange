import { Signer } from "@ethersproject/abstract-signer";
import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";

import { Order, Side } from "../types";

import ExchangeAbi from "../abis/Exchange.json";

export default class WyvernHelper {
  // --------------- Public ---------------

  public static async match(
    relayer: Signer,
    buyOrder: Order,
    sellOrder: Order
  ) {
    if (buyOrder.side !== Side.BUY) {
      throw new Error("Invalid buy order side");
    }
    if (sellOrder.side !== Side.SELL) {
      throw new Error("Invalid sell order side");
    }

    if (buyOrder.exchange.toLowerCase() !== sellOrder.exchange.toLowerCase()) {
      throw new Error("Mismatching exchange");
    }

    const addrs = [
      buyOrder.exchange,
      buyOrder.maker,
      buyOrder.taker,
      buyOrder.feeRecipient,
      buyOrder.target,
      buyOrder.staticTarget,
      buyOrder.paymentToken,
      sellOrder.exchange,
      sellOrder.maker,
      sellOrder.taker,
      sellOrder.feeRecipient,
      sellOrder.target,
      sellOrder.staticTarget,
      sellOrder.paymentToken,
    ];

    const uints = [
      buyOrder.makerRelayerFee,
      buyOrder.takerRelayerFee,
      0, // makerProtocolFee is always 0
      0, // takerProtocolFee is always 0
      buyOrder.basePrice,
      buyOrder.extra,
      buyOrder.listingTime,
      buyOrder.expirationTime,
      buyOrder.salt,
      sellOrder.makerRelayerFee,
      sellOrder.takerRelayerFee,
      0, // makerProtocolFee is always 0
      0, // takerProtocolFee is always 0
      sellOrder.basePrice,
      sellOrder.extra,
      sellOrder.listingTime,
      sellOrder.expirationTime,
      sellOrder.salt,
    ];

    const feeMethodsSidesKindsHowToCalls = [
      1, // feeMethod is always 1 (SplitFee)
      buyOrder.side,
      buyOrder.saleKind,
      buyOrder.howToCall,
      1, // feeMethod is always 1 (SplitFee)
      sellOrder.side,
      sellOrder.saleKind,
      sellOrder.howToCall,
    ];

    return new Contract(buyOrder.exchange, ExchangeAbi as any)
      .connect(relayer)
      .atomicMatch_(
        addrs,
        uints,
        feeMethodsSidesKindsHowToCalls,
        buyOrder.calldata,
        sellOrder.calldata,
        buyOrder.replacementPattern,
        sellOrder.replacementPattern,
        buyOrder.staticExtradata,
        sellOrder.staticExtradata,
        [buyOrder.v, sellOrder.v],
        [
          buyOrder.r,
          buyOrder.s,
          sellOrder.r,
          sellOrder.s,
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        ],
        {
          value:
            sellOrder.paymentToken === AddressZero ? sellOrder.basePrice : 0,
        }
      );
  }
}
