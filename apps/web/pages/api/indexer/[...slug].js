const axios = require('axios')

export default function handler(req, res) {
    const { slug } = req.query
    const contract = slug[0]
    const tokenId = slug[1]
    const base = process.env.NEXT_PUBLIC_CHAIN_ID == 4
    ? 'https://rinkeby-api.opensea.io/api/v1/asset'
    : 'https://api.opensea.io/api/v1/asset';
    let url = `${base}/${contract}/${tokenId}`
    axios.get(url).then((response) => {
        if(response.data) {
            let meta = {
                "name": `${response.data.name}`,
                "description": `${response.data.description}`, 
                "image": `${response.data.image_url}`,
                "collection": {
                    "id":`${response.data.collection.slug}`,
                    "name": `${response.data.collection.name}`,
                    "description": `${response.data.collection.description}`,
                    "image": `${response.data.collection.image_url}`,
                },
                "attributes":response.data.traits.map(trait => {
                    return {
                        "category":"Properties",
                        "key": trait.trait_type,
                        "value": trait.value
                    }
                })
              }
            res.status(200).json(meta);
        } else {
            res.status(200).json({error: "Not found"});
        }
    }).catch((error)=>{
        res.status(200).json({error: "Unknown error"});
    })
  }