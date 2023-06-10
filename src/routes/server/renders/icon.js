const Router = require("express").Router;
const router = new Router();

const axios = require("axios");

const resize = require("../../../utils/canvas/resize");
const getIcon = require("../../../utils/server/getIcon");

router.get("/icon/:value", async (req, res) => {
    const image = await getIcon(encodeURIComponent(req.params.value));

    let { width, height } = req.query;
    if (!width || !height) {
        width = 128;
        height = 128;
    }

    if (isNaN(width) || isNaN(height)) {
        res.status(400).json({
            success: false,
            message: "Width and height must be number.",
        });
    }

    if (image.error) {
        res.status(404).json({
            success: false,
            message: image.message,
        });
    }

    const resizedIcon = await resize(image.data, Number(width), Number(height));
    res.end(resizedIcon);
});

module.exports = router;
