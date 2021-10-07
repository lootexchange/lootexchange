const { BigNumber } = require("@ethersproject/bignumber");
const { id } = require("@ethersproject/hash");

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

const getMetadata = id => {
  let meta = {
    items: {},
    scores: {
      greatness: 0
    },
    greatness: {}
  };
  for (let keyPrefix in items) {
    let tokenId = BigNumber.from(id);
    const rand = random(keyPrefix + tokenId.toString());
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
