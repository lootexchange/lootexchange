const { BigNumber } = require("@ethersproject/bignumber");
const { id } = require("@ethersproject/hash");
import { request, gql } from 'graphql-request'

let items = [
  'chest',
  'foot',
  'hand',
  'head',
  'neck',
  'ring',
  'waist',
  'weapon'
]
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}

const api = async (req, res) => {
  const { id } = req.query
  // let meta = await getMetadata(id)
  // console.log(meta)
  request('https://api.thegraph.com/subgraphs/name/treppers/genesisproject', gql`{
    adventurers(where: {id: "${id}"}) {
      id,
      chest,
      foot,
      hand,
      head,
      neck,
      ring,
      waist,
      weapon,
      order,
      orderCount
    }
  }`).then((data) => {
    console.log(data.adventurers)
    //res.status(200).json(data);
    if(data.adventurers && data.adventurers.length>0) {
      let meta = {
        "name": `Genesis Adventurer #${id}`,
        "description": "This item is a Genesis Adventurer used in Loot (for Adventurers)",
        "image": `https://www.loot.exchange/api/image/${id}`,
        "collection": {
          "id":"genesis-adventurers",
          "name":"Genesis Adventurers",
          "description":"You’ve collected a complete set of Genesis Loot (\"Genesis Mana\"), one for each item type, all of the same Order. You carry this precious Genesis Loot on your back, and climb to the top of the mountain to attempt to resurrect a Genesis Adventurer. You throw the bag in the fire — a Genesis Adventurer emerges from the flames. Thus returned to defend its original Order, each Genesis Adventurer will entitle the owner to benefits and rewards, including unique access to claim derivative projects, airdropped ERC20 tokens similar to $AGLD and more.",
          "image":"https://lh3.googleusercontent.com/46LiRFAvwemkfLlRZIp4WbK21gWUWzFKIhes-FRfjAKdQeXbEue2cICtiQjZ_hT8GXgf28TfxyVYu5098vcpW9-KHsB9cZSuwVci=s130"
        },
        "attributes":[]
      }
      let scores = {
        "names":0,
        "plusones":0
      }
      for(let item of items) {
        meta.attributes.push({
          "category": "Items",
          "key": `${capitalize(item)}`,
          "value": data.adventurers[0][item]
        })
        if(data.adventurers[0][item].slice(-2)=="+1") {
          scores.plusones++
        }
        if(data.adventurers[0][item].slice(0,1)=='"') {
          scores.names++
        }
      }
      meta.attributes.push({
        "category": "Properties",
        "key": `Order`,
        "value": data.adventurers[0].order
      })
      meta.attributes.push({
        "category": "Properties",
        "key": `Order Count`,
        "value": data.adventurers[0].orderCount
      })
      meta.attributes.push({
        "category": "Properties",
        "key": `Plus Ones`,
        "value": scores.plusones
      })
      meta.attributes.push({
        "category": "Properties",
        "key": `Names`,
        "value": scores.names
      })
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