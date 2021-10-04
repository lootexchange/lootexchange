const { BigNumber } = require("@ethersproject/bignumber");
const { id } = require("@ethersproject/hash");

let items = {}

items.WEAPON = [
  "Warhammer",
  "Quarterstaff",
  "Maul",
  "Mace",
  "Club",
  "Katana",
  "Falchion",
  "Scimitar",
  "Long Sword",
  "Short Sword",
  "Ghost Wand",
  "Grave Wand",
  "Bone Wand",
  "Wand",
  "Grimoire",
  "Chronicle",
  "Tome",
  "Book",
];

items.CHEST = [
  "Divine Robe",
  "Silk Robe",
  "Linen Robe",
  "Robe",
  "Shirt",
  "Demon Husk",
  "Dragonskin Armor",
  "Studded Leather Armor",
  "Hard Leather Armor",
  "Leather Armor",
  "Holy Chestplate",
  "Ornate Chestplate",
  "Plate Mail",
  "Chain Mail",
  "Ring Mail",
];

items.HEAD = [
  "Ancient Helm",
  "Ornate Helm",
  "Great Helm",
  "Full Helm",
  "Helm",
  "Demon Crown",
  "Dragon's Crown",
  "War Cap",
  "Leather Cap",
  "Cap",
  "Crown",
  "Divine Hood",
  "Silk Hood",
  "Linen Hood",
  "Hood",
];

items.WAIST = [
  "Ornate Belt",
  "War Belt",
  "Plated Belt",
  "Mesh Belt",
  "Heavy Belt",
  "Demonhide Belt",
  "Dragonskin Belt",
  "Studded Leather Belt",
  "Hard Leather Belt",
  "Leather Belt",
  "Brightsilk Sash",
  "Silk Sash",
  "Wool Sash",
  "Linen Sash",
  "Sash",
];

items.FOOT = [
  "Holy Greaves",
  "Ornate Greaves",
  "Greaves",
  "Chain Boots",
  "Heavy Boots",
  "Demonhide Boots",
  "Dragonskin Boots",
  "Studded Leather Boots",
  "Hard Leather Boots",
  "Leather Boots",
  "Divine Slippers",
  "Silk Slippers",
  "Wool Shoes",
  "Linen Shoes",
  "Shoes",
];

items.HAND = [
  "Holy Gauntlets",
  "Ornate Gauntlets",
  "Gauntlets",
  "Chain Gloves",
  "Heavy Gloves",
  "Demon's Hands",
  "Dragonskin Gloves",
  "Studded Leather Gloves",
  "Hard Leather Gloves",
  "Leather Gloves",
  "Divine Gloves",
  "Silk Gloves",
  "Wool Gloves",
  "Linen Gloves",
  "Gloves",
];

items.NECK = ["Necklace", "Amulet", "Pendant"];

items.RING = [
  "Gold Ring",
  "Silver Ring",
  "Bronze Ring",
  "Platinum Ring",
  "Titanium Ring",
];

const suffixes = [
  "of Power",
  "of Giants",
  "of Titans",
  "of Skill",
  "of Perfection",
  "of Brilliance",
  "of Enlightenment",
  "of Protection",
  "of Anger",
  "of Rage",
  "of Fury",
  "of Vitriol",
  "of the Fox",
  "of Detection",
  "of Reflection",
  "of the Twins",
];

const namePrefixes = [
  "Agony",
  "Apocalypse",
  "Armageddon",
  "Beast",
  "Behemoth",
  "Blight",
  "Blood",
  "Bramble",
  "Brimstone",
  "Brood",
  "Carrion",
  "Cataclysm",
  "Chimeric",
  "Corpse",
  "Corruption",
  "Damnation",
  "Death",
  "Demon",
  "Dire",
  "Dragon",
  "Dread",
  "Doom",
  "Dusk",
  "Eagle",
  "Empyrean",
  "Fate",
  "Foe",
  "Gale",
  "Ghoul",
  "Gloom",
  "Glyph",
  "Golem",
  "Grim",
  "Hate",
  "Havoc",
  "Honour",
  "Horror",
  "Hypnotic",
  "Kraken",
  "Loath",
  "Maelstrom",
  "Mind",
  "Miracle",
  "Morbid",
  "Oblivion",
  "Onslaught",
  "Pain",
  "Pandemonium",
  "Phoenix",
  "Plague",
  "Rage",
  "Rapture",
  "Rune",
  "Skull",
  "Sol",
  "Soul",
  "Sorrow",
  "Spirit",
  "Storm",
  "Tempest",
  "Torment",
  "Vengeance",
  "Victory",
  "Viper",
  "Vortex",
  "Woe",
  "Wrath",
  "Light's",
  "Shimmering",
];

const nameSuffixes = [
  "Bane",
  "Root",
  "Bite",
  "Song",
  "Roar",
  "Grasp",
  "Instrument",
  "Glow",
  "Bender",
  "Shadow",
  "Whisper",
  "Shout",
  "Growl",
  "Tear",
  "Peak",
  "Form",
  "Sun",
  "Moon",
];

const getWeapon = (tokenId) => pluck(tokenId, "WEAPON");
const getChest = (tokenId) => pluck(tokenId, "CHEST");
const getHead = (tokenId) => pluck(tokenId, "HEAD");
const getWaist = (tokenId) => pluck(tokenId, "WAIST");
const getFoot = (tokenId) => pluck(tokenId, "FOOT");
const getHand = (tokenId) => pluck(tokenId, "HAND");
const getNeck = (tokenId) => pluck(tokenId, "NECK");
const getRing = (tokenId) => pluck(tokenId, "RING");

const random = (input) => BigNumber.from(id(input));

const getMetadata = (id) => {
  let meta = {
    "items": {},
    "itemOrders":{},
    "scores":{
      "greatness":0,
      "orders":0,
      "names":0,
      "plusones":0
    },
    "greatness": {}
  }
  for(let keyPrefix in items) {
    let sourceArray = items[keyPrefix]
    let tokenId = BigNumber.from(id);
    const rand = random(keyPrefix + tokenId.toString());
    let output = sourceArray[rand.mod(sourceArray.length).toNumber()];
    const greatness = rand.mod(21);
    meta.scores.greatness += greatness.toNumber();
    meta.greatness[keyPrefix.toLowerCase()] = greatness.toNumber();
    if (greatness.gt(14)) {
      meta.scores.orders++
      let order = suffixes[rand.mod(suffixes.length).toNumber()]
      meta.itemOrders[keyPrefix.toLowerCase()] = order
      output = output + " " + order;
    }
    if (greatness.gte(19)) {
      meta.scores.names++
      const name = ["", ""];
      name[0] = namePrefixes[rand.mod(namePrefixes.length).toNumber()];
      name[1] = nameSuffixes[rand.mod(nameSuffixes.length).toNumber()];
      if (greatness.eq(19)) {
        output = '"' + name[0] + " " + name[1] + '" ' + output;
      } else {
        meta.scores.plusones++  
        output = '"' + name[0] + " " + name[1] + '" ' + output + " +1";
      }
    }
    meta.items[keyPrefix.toLowerCase()] = output
  }
  return meta
}

const api = async (req, res) => {
  const { id } = req.query
  let meta = getMetadata(id)
  res.status(200).json(meta);
};

export default api;