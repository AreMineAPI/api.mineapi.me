const { createCanvas, loadImage } = require('canvas');

module.exports = (src, width, height) => {
    return loadImage(src).then(image => {
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');

        context.patternQuality = "fast";
        context.drawImage(image, 0, 0, width, height);

        return canvas.toBuffer();
    });
}