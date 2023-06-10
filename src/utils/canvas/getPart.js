const { createCanvas, loadImage } = require("canvas");

module.exports = (src, x, y, width, height, buffer = true) => {
    return loadImage(src).then((image) => {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        ctx.patternQuality = "fast";
        ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

        if (buffer) return canvas.toBuffer();
        return canvas;
    });
};
