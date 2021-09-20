import { defaultAbiCoder } from "@ethersproject/abi";
import { Signer } from "@ethersproject/abstract-signer";
import { arrayify, splitSignature } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/solidity";
import { verifyMessage } from "@ethersproject/wallet";

import { Order } from "../types";

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

export default class OrderHelper {
  // --------------- Public ---------------

  public static normalize(order: Order): Order {
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

  public static encode(order: Order): string {
    return defaultAbiCoder.encode(
      [
        // Skip `makerProtocolFee`, `takerProtocolFee` and `feeMethod`
        ...WYVERN_ORDER_FIELDS.filter((_, index) => ![5, 6, 8].includes(index)),
        ...SIGNATURE_FIELDS,
      ],
      [
        // Skip `makerProtocolFee`, `takerProtocolFee` and `feeMethod`
        ...this.toRaw(order).filter((_, index) => ![5, 6, 8].includes(index)),
        order.v,
        order.r,
        order.s,
      ]
    );
  }

  public static decode(order: string): Order {
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

  public static async sign(signer: Signer, order: Order): Promise<Order> {
    const rawWyvernOrderHash = keccak256(
      WYVERN_ORDER_FIELDS,
      this.toRaw(order)
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

  public static verifySignature(order: Order): boolean {
    const rawWyvernOrderHash = keccak256(
      WYVERN_ORDER_FIELDS,
      this.toRaw(order)
    );

    try {
      const signerAddress = verifyMessage(arrayify(rawWyvernOrderHash), {
        v: order.v,
        r: order.r,
        s: order.s,
      });
      return signerAddress.toLowerCase() === order.maker.toLowerCase();
    } catch {
      return false;
    }
  }

  // --------------- Private ---------------

  private static toRaw(order: Order): any[] {
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
