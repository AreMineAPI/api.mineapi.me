
const Router = require('express').Router;
const router = new Router();

const axios = require('axios');
const bustBody = require('../../../utils/canvas/bustBody');
const getSkin = require('../../../utils/user/getSkin');

router.get('/bust/:value', async (req, res) => {
    const skin = await getSkin(req.params.value);
    let { width, height, overlay } = req.query;
    if (!overlay) overlay = "true";
    if (!width || !height) {
        width = 512;
        height = 512;
    }
    
    if (isNaN(width) || isNaN(height)) {
        res.status(400).json({
            success: false,
            message: "Width and height must be number."
        });
    }

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
        res.setHeader('Content-Disposition', 'filename="bust.png"');
        const HeadImage = await bustBody(response.data, Number(width), Number(height), skin.is_slim, overlay === "true" ? true : false);
        res.end(HeadImage);
    }).catch(err => console.log(`/bust/${req.params.value} Error: ${err.message}`));
});

module.exports = router;