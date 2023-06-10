const Router = require("express").Router;
const router = new Router();

const axios = require("axios");

const resize = require("../../../utils/canvas/resize");
const getCapes = require("../../../utils/user/getCapes");

router.get("/cape/:value", async (req, res) => {
    let type = req.query.type;
    if (!type) type = "optifine";
    const cape = await getCapes(req.params.value, type);
    let { width, height } = req.query;
    if (!["optifine", "minecraftcapes", "mojang"].includes(type))
        return res.status(400).json({
            success: false,
            message: "Invalid type.",
        });

    if (!width || !height) {
        width = 512;
        height = 512;
    }

    if (isNaN(width) || isNaN(height)) {
        res.status(400).json({
            success: false,
            message: "Width and height must be number.",
        });
    }

    if (cape.error) {
        res.status(404).json({
            success: false,
            message: cape.message,
        });
    }

    const image = cape?.data?.[type]
        ? type === "mojang"
            ? "http://textures.minecraft.net/texture/" + cape?.data?.[type]
            : cape?.data?.[type]
        : cape?.data?.optifine;

    axios
        .get(image, {
            responseType: "arraybuffer",
        })
        .then(async (response) => {
            res.setHeader("Content-Disposition", 'filename="cape.png"');
            res.end(response.data);
        })
        .catch((err) =>
            console.log(`/cape/${req.params.value} Error: ${err.message}`)
        );
});

module.exports = router;
