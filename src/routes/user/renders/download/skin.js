const Router = require('express').Router;
const router = new Router();

const axios = require('axios');

const resize = require('../../../../utils/canvas/resize');
const getSkin = require('../../../../utils/user/getSkin');
const Database = require('../../../../database/models/userNames');

router.get('/download/skin/:value', async (req, res) => {
    const skin = await getSkin(req.params.value);
    let { width, height } = req.query;
    if (!width || !height) {
        width = 557;
        height = 600;
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

        await Database.updateOne({
            name: req.params.value
        }, {
            $inc: {
                downloads: 1
            }
        });
        const image = await resize(response.data, Number(width), Number(height));
        res.setHeader('Content-disposition', 'attachment; filename= skin-' + req.params.value + '.png');

        res.end(image);
    }).catch(err => console.log(`/download/skin/${req.params.value} Error: ${err.message}`));
});

module.exports = router;