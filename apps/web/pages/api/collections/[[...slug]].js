import Cors from 'cors'
import initMiddleware from '../../../lib/init-middleware'
const axios = require('axios')

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)


export default async function handler(req, res) {
  // Run cors
  await cors(req, res)

  const { slug } = req.query
  
  let url = 'https://data.rarity.tools/prices/lootproject'
  let data = await axios.get(url)

  // Rest of the API logic
  res.json(data.data)
}