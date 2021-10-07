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
    let sourceArray = items[keyPrefix];
    let tokenId = BigNumber.from(id);
    const rand = random(keyPrefix + tokenId.toString());
    let output = sourceArray[rand.mod(sourceArray.length).toNumber()];
    const greatness = rand.mod(21);
    meta.scores.greatness += greatness.toNumber();
    meta.greatness[keyPrefix.toLowerCase()] = greatness.toNumber();
  }
  return meta;
};

const api = async (req, res) => {
  const { id } = req.query;
  let meta = getMetadata(id);
  res.status(200).json(meta);
};

export default api;
