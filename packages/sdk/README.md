# Loot Exchange SDK

This repository contains an SDK for interacting with instances of Wyvern V2 contracts.

### Usage

```typescript
import { Builders, Helpers, Order } from "@lootexchange/sdk";

// Create an unsigned sell order
let sellOrder: Order = Builders.Erc721.SingleItem.sell({
  exchange: exchange.address,
  maker: seller.address,
  target: erc721.address,
  tokenId: 0,
  paymentToken: AddressZero,
  basePrice: parseEther("1"),
  fee: 250,
  feeRecipient: feeRecipient.address,
  listingTime: Math.floor(Date.now() / 1000) - 300,
  expirationTime: 0,
  salt: 0,
});
// Sign the sell order
sellOrder = await Helpers.Order.sign(seller, sellOrder);

// Create a matching buy order for the sell order
const buyOrder: Order = Builders.Erc721.SingleItem.matchingBuy(
  buyer.address,
  sellOrder
);

// Trigger settlement
await Helpers.Wyvern.match(buyer, buyOrder, sellOrder);
```
