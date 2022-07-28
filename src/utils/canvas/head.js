const { createCanvas, loadImage } = require('canvas');
const resize = require('./resize');
const removeTransparency = require('./removeTransparency');
const getPart = require('./getPart');

module.exports = (src, width, height, overlay = true) => {
    return loadImage(src).then(async image => {
        const newHeight = (1024 / (image.height === 64 ? 1 : 2));
        const canvas = createCanvas(1024, newHeight);
        const ctx = canvas.getContext('2d');

        ctx.patternQuality = "fast";
        ctx.drawImage(image, 0, 0, 1024, newHeight);

        const all = createCanvas(128, 128);
        const allCtx = all.getContext('2d');

        const bufferedCanvas = canvas.toBuffer();

        const head_front            = await getPart(bufferedCanvas, 128, 128, 128, 128, false);
        const head_overlay          = await getPart(bufferedCanvas, 640, 128, 128, 128, false);

        allCtx.drawImage(head_front, 0, 0, head_front.width, head_front.height);
        if (overlay) allCtx.drawImage(head_overlay, 0, 0, head_overlay.width, head_overlay.height);

        return resize(all.toBuffer(), width, height);
    });
}