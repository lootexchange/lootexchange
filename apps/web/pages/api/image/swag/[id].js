const axios = require('axios')

const api = async (req, res) => {
    const { id } = req.query
    try {
        let base = 'https://api.lootswag.io/'
        let metadataURL = `${base}api/v1/common/searchLootByLootId?lootId=${id}&lootType=0`
        axios.get(metadataURL).then(async (api) => {
            let imageURL = base+ api.data.data.avatar
            axios({
                method: 'get',
                url: imageURL,
                responseType: 'stream'
            }).then(function(response) {
                res.setHeader('content-type', 'image/x-png');
                response.data.pipe(res)
            });
        })
    } catch {
        return res.json({ error: { message: "Internal error" } });
    }
};

export default api;