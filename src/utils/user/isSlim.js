const { createCanvas, loadImage } = require("canvas");

module.exports = (src) => {
    const Alex = "";

    return loadImage(src).then(async (image) => {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        ctx.patternQuality = "fast";
        ctx.drawImage(image, 0, 0, width, height);
    });
};
