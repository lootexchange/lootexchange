import { ethers } from "ethers";
const { BigNumber } = require("@ethersproject/bignumber");
const { id, address } = require("@ethersproject/hash");
const { sha3 } = require("web3-utils");

let items = {};

items.WEAPON = [];

items.CHEST = [];

items.HEAD = [];

items.WAIST = [];

items.FOOT = [];

items.HAND = [];

items.NECK = [];

items.RING = [];

const random = input => BigNumber.from(id(input));

const getMetadata = token => {
  let meta = {
    items: {},
    scores: {
      greatness: 0
    },
    greatness: {}
  };
  for (let keyPrefix in items) {
    // not really sure what needs to happen if it's an address
    let tokenId = ethers.utils.isAddress(token)
      ? token
      : BigNumber.from(token).toString();

    const rand = random(keyPrefix + tokenId);
    const greatness = rand.mod(21);
    meta.scores.greatness += greatness.toNumber();
    meta.greatness[keyPrefix.toLowerCase()] = greatness.toNumber();
  }
  return meta;
};

function memoizer(fun) {
  let cache = {};

  return function(n) {
    if (cache[n] != undefined) {
      return cache[n];
    } else {
      let result = fun(n);
      cache[n] = result;

      return result;
    }
  };
}

export default memoizer(getMetadata);
