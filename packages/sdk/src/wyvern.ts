import { defaultAbiCoder } from "@ethersproject/abi";
import { Signer } from "@ethersproject/abstract-signer";
import { arrayify, splitSignature } from "@ethersproject/bytes";
import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import { keccak256 } from "@ethersproject/solidity";

import { Order, Side } from "./types";

import ExchangeAbi from "./abis/Exchange.json";

const WYVERN_ORDER_FIELDS = [
  "address", // exchange
  "address", // maker
  "address", // taker
  "uint", // makerRelayerFee
  "uint", // takerRelayerFee
  "uint", // makerProtocolFee (always 0)
  "uint", // takerProtocolFee (always 0)
  "address", // feeRecipient
  "uint8", // feeMethod (always 1)
  "uint8", // side
  "uint8", // saleKind
  "address", // target
  "uint8", // howToCall
  "bytes", // calldata
  "bytes", // replacementPattern
  "address", // staticTarget
  "bytes", // staticExtradata
  "address", // paymentToken
  "uint", // basePrice
  "uint", // extra
  "uint", // listingTime
  "uint", // expirationTime
  "uint", // salt
];

const SIGNATURE_FIELDS = [
  "uint8", // v
  "bytes32", // r
  "bytes32", // s
];

export default class Wyvern {
  // --------------- Public ---------------

  public normalizeOrder(order: Order): Order {
    // Convert all strings to lowercase and all bignumbers to strings
    return {
      exchange: order.exchange.toLowerCase(),
      maker: order.maker.toLowerCase(),
      taker: order.taker.toLowerCase(),
      makerRelayerFee: order.makerRelayerFee.toString(),
      takerRelayerFee: order.takerRelayerFee.toString(),
      feeRecipient: order.feeRecipient.toLowerCase(),
      side: order.side,
      saleKind: order.saleKind,
      target: order.target.toLowerCase(),
      howToCall: order.howToCall,
      calldata: order.calldata,
      replacementPattern: order.replacementPattern,
      staticTarget: order.staticTarget.toLowerCase(),
      staticExtradata: order.staticExtradata,
      paymentToken: order.paymentToken.toLowerCase(),
      basePrice: order.basePrice.toString(),
      extra: order.extra.toString(),
      listingTime: order.listingTime.toString(),
      expirationTime: order.expirationTime.toString(),
      salt: order.salt.toString(),
      v: order.v,
      r: order.r,
      s: order.s,
    };
  }

  public encodeOrder(order: Order): string {
    return defaultAbiCoder.encode(
      [
        // Skip `makerProtocolFee`, `takerProtocolFee` and `feeMethod`
        ...WYVERN_ORDER_FIELDS.filter((_, index) => ![5, 6, 8].includes(index)),
        ...SIGNATURE_FIELDS,
      ],
      [
        // Skip `makerProtocolFee`, `takerProtocolFee` and `feeMethod`
        ...this.toRawWyvernOrder(order).filter(
          (_, index) => ![5, 6, 8].includes(index)
        ),
        order.v,
        order.r,
        order.s,
      ]
    );
  }

  public decodeOrder(order: string): Order {
    const result = defaultAbiCoder.decode(
      [
        // Remove `makerProtocolFee`, `takerProtocolFee` and `feeMethod`
        ...WYVERN_ORDER_FIELDS.filter((_, index) => ![5, 6, 8].includes(index)),
        ...SIGNATURE_FIELDS,
      ],
      order
    );

    return {
      exchange: result[0],
      maker: result[1],
      taker: result[2],
      makerRelayerFee: result[3],
      takerRelayerFee: result[4],
      feeRecipient: result[5],
      side: result[6],
      saleKind: result[7],
      target: result[8],
      howToCall: result[9],
      calldata: result[10],
      replacementPattern: result[11],
      staticTarget: result[12],
      staticExtradata: result[13],
      paymentToken: result[14],
      basePrice: result[15],
      extra: result[16],
      listingTime: result[17],
      expirationTime: result[18],
      salt: result[19],
      v: result[20],
      r: result[21],
      s: result[22],
    };
  }

  public async signOrder(signer: Signer, order: Order): Promise<Order> {
    const rawWyvernOrderHash = keccak256(
      WYVERN_ORDER_FIELDS,
      this.toRawWyvernOrder(order)
    );

    // Sign the order hash and populate the signature fields
    await signer
      .signMessage(arrayify(rawWyvernOrderHash))
      .then(splitSignature)
      .then(({ v, r, s }) => {
        order = { ...order, v, r, s };
      });

    return order;
  }

  public async matchOrders(relayer: Signer, buyOrder: Order, sellOrder: Order) {
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

  // --------------- Private ---------------

  private toRawWyvernOrder(order: Order): any[] {
    // Construct raw order including all fields needed by Wyvern
    return [
      order.exchange,
      order.maker,
      order.taker,
      order.makerRelayerFee,
      order.takerRelayerFee,
      0, // makerProtocolFee is always 0
      0, // takerProtocolFee is always 1
      order.feeRecipient,
      1, // feeMethod is always 1 (SplitFee)
      order.side,
      order.saleKind,
      order.target,
      order.howToCall,
      order.calldata,
      order.replacementPattern,
      order.staticTarget,
      order.staticExtradata,
      order.paymentToken,
      order.basePrice,
      order.extra,
      order.listingTime,
      order.expirationTime,
      order.salt,
    ];
  }
}
