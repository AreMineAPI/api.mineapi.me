const Router = require('express').Router;
const router = new Router();

const axios = require('axios');

const resize = require('../../../utils/canvas/resize');
const getSkin = require('../../../utils/user/getSkin');

router.get('/skin/:value', async (req, res) => {
    const skin = await getSkin(req.params.value);

    if (skin.error) {
        res.status(404).json({
            success: false,
            message: skin.message
        });
    }

    const texture = skin.data;
    const image = "http://textures.minecraft.net/texture/" + texture;

    axios.get(image, {
        responseType: 'arraybuffer'
    }).then(async response => {
        res.setHeader('Content-Disposition', 'filename="skin.png"');
        res.end(response.data);
    }).catch(err => console.log(`/skin/${req.params.value} Error: ${err.message}`));
});

module.exports = router;