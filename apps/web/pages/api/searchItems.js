import fetch from "node-fetch";
import lootItems from "../../data/itemToPositionMap.json";
import Fuse from "fuse.js";

const fuse = new Fuse(Object.keys(lootItems), { includeScore: true });

const api = async (req, res) => {
  let { q } = req.query;
  const results = fuse.search(q);

  res.status(200).json(
    results.slice(0, 20).map(result => ({
      name: result.item,
      id: result.refIndex
    }))
  );
};

export default api;
