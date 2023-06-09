const { createCanvas, loadImage } = require("canvas");

module.exports = (src) => {
    return loadImage(src).then(async (image) => {
        let defaultRGB = { r: 0, b: 0, g: 0 };
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");

        ctx.patternQuality = "fast";
        ctx.drawImage(image, 0, 0, image.width, image.height);

        try {
            const imageData = ctx.getImageData(0, 0, image.width, image.height);
            const data = imageData.data;
            let r = 0,
                g = 0,
                b = 0;

            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }
            r = Math.floor(r / (image.width * image.height));
            g = Math.floor(g / (image.width * image.height));
            b = Math.floor(b / (image.width * image.height));

            return {
                hex: `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`,
                rgb: [r, g, b],
            };
        } catch (e) {
            console.log(e.message);
            return defaultRGB;
        }
    });
};
