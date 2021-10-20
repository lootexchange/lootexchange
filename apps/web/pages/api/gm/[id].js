const { BigNumber } = require("@ethersproject/bignumber");
const { id } = require("@ethersproject/hash");
import { request, gql } from 'graphql-request'
import {
  itemRarity,
  rarityColor,
  rarityDescription,
  lootRarity
} from "loot-rarity";

let items = [
  "Weapon",       //1
  "Chest Armor",  //2
  "Head Armor",   //3
  "Waist Armor",  //4
  "Foot Armor",   //5
  "Hand Armor",   //6
  "Neck Armor",   //7
  "Ring"          //8
]
let suffixes = [
  ["",""],                         // 0
  ["Power","#191D7E"],             // 1
  ["Giants","#DAC931"],            // 2
  ["Titans","#B45FBB"],            // 3
  ["Skill","#1FAD94"],             // 4
  ["Perfection","#2C1A72"],        // 5
  ["Brilliance","#36662A"],        // 6
  ["Enlightenment","#78365E"],     // 7
  ["Protection","#4F4B4B"],        // 8
  ["Anger","#9B1414"],             // 9
  ["Rage","#77CE58"],              // 10
  ["Fury","#C07A28"],              // 11
  ["Vitriol","#511D71"],           // 12
  ["the Fox","#949494"],           // 13
  ["Detection","#DB8F8B"],         // 14
  ["Reflection","#318C9F"],        // 15
  ["the Twins","#00AE3B"]          // 16
]
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}
const random = input => BigNumber.from(id(input));

const api = async (req, res) => {
  const { id } = req.query
  // let meta = await getMetadata(id)
  // console.log(meta)
  request('https://api.thegraph.com/subgraphs/name/treppers/genesisproject', gql`{
    manas(where: {id: ${id}}) {
      id,
      lootTokenId {
        id
      },
      itemName,
      suffixId {
        id
      },
      inventoryId
    }
  }`).then((data) => {
    console.log(data.manas)
    //res.status(200).json(data);
    if(data.manas && data.manas.length>0) {
      let meta = {
        "name": `Genesis Mana #${id}`,
        "description": "This item is Genesis Mana used in Loot (for Adventurers)",
        "image": `https://www.loot.exchange/api/image/${id}`,
        "attributes":[]
      }
      meta.attributes.push({
        "category": "Properties",
        "key": `Item Name`,
        "value": data.manas[0].itemName
      })
      let itemType = items[data.manas[0].inventoryId]
      meta.attributes.push({
        "category": "Properties",
        "key": `Item Type`,
        "value": itemType
      })
      meta.attributes.push({
        "category": "Properties",
        "key": `Order`,
        "value": suffixes[data.manas[0].suffixId.id][0]
      })
      let bagId = data.manas[0].lootTokenId.id
      meta.attributes.push({
        "category": "Properties",
        "key": `Loot Bag ID`,
        "value": bagId
      })
      const rand = random(itemType.split(" ")[0].toUpperCase() + data.manas[0].lootTokenId.id);
      const greatness = rand.mod(21);
      meta.attributes.push({
        "category": "Properties",
        "key": `Greatness`,
        "value": greatness.toString()
      })
      meta.attributes.push({
        "category": "Properties",
        "key": `Rarity`,
        "value": rarityDescription(itemRarity(data.manas[0].itemName))
      })
      
      // meta.attributes.push({
      //   "category": "Properties",
      //   "key": `Order Count`,
      //   "value": data.adventurers[0].orderCount
      // })
      // meta.attributes.push({
      //   "category": "Properties",
      //   "key": `Plus Ones`,
      //   "value": scores.plusones
      // })
      // meta.attributes.push({
      //   "category": "Properties",
      //   "key": `Names`,
      //   "value": scores.names
      // })
      console.log(meta)
      res.status(200).json(meta);
    } else {
      res.status(200).json({error: "Not found"});
    }
  }).catch((e)=>{
    res.status(200).json({error: "Unknown error"});
  })
};

export default api;