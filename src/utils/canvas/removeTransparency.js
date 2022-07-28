const { createCanvas, loadImage } = require('canvas');

module.exports = src => {
    return loadImage(src).then(image => {
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        ctx.patternQuality = "fast";
        ctx.drawImage(image, 0, 0);

        var imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imagedata.data;

        for (var i = 0; i < data.length; i += 4) {
            data[i + 3] = 255;
        }

        ctx.putImageData(imagedata, 0, 0);
        return canvas.toBuffer();
    });
}