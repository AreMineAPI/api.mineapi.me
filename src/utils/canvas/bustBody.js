const { createCanvas, loadImage } = require('canvas');
const resize = require('./resize');
const removeTransparency = require('./removeTransparency');
const getPart = require('./getPart');

module.exports = (src, W, H, is_slim = false, overlay = true) => {
    const width = 256;
    const height = 256;

    return loadImage(src).then(async image => {
        const newHeight = 1024 / (image.height === 64 ? 1 : 2);
        const canvas = createCanvas(1024, newHeight);
        const ctx = canvas.getContext('2d');

        ctx.patternQuality = "fast";
        ctx.drawImage(image, 0, 0, 1024, newHeight);

        const all = createCanvas(width, height);
        const allCtx = all.getContext('2d');

        const bufferedCanvas = canvas.toBuffer();

        const head_front            = await getPart(bufferedCanvas, 128, 128, 128, 128, false);
        const body_front            = await getPart(bufferedCanvas, 320, 320, 128, 199, false);
        const right_arm             = await getPart(bufferedCanvas, 832, 320, (is_slim ? 32 : 64), 199, false);
        const left_arm              = await getPart(bufferedCanvas, (image.height === 64 ? 702 : 700), (image.height === 64 ? 832 : 320), (is_slim ? 32 : 64), 199, false);
        const head_overlay          = await getPart(bufferedCanvas, 640, 128, 128, 128, false);
        const body_overlay          = await getPart(bufferedCanvas, 320, 576, 128, 199, false);
        const right_arm_overlay     = await getPart(bufferedCanvas, 704, 576, (is_slim ? 32 : 64), 199, false);
        const left_arm_overlay      = await getPart(bufferedCanvas, 832, 832, (is_slim ? 32 : 64), 199, false);

        allCtx.drawImage(head_front,    ((is_slim ? 32 : 0) + left_arm.width), 0, head_front.width, head_front.height);
        if (overlay) allCtx.drawImage(head_overlay,  ((is_slim ? 32 : 0) + left_arm.width), 0, head_overlay.width, head_overlay.height);
        allCtx.drawImage(body_front,    ((is_slim ? 32 : 0) + left_arm.width), 128, body_front.width, body_front.height);
        if (overlay) allCtx.drawImage(body_overlay,  ((is_slim ? 32 : 0) + left_arm.width), 128, body_overlay.width, body_overlay.height);
        allCtx.drawImage(left_arm,      (is_slim ? 32 : 0), 128, left_arm.width, left_arm.height);
        if (overlay) allCtx.drawImage(left_arm_overlay, (is_slim ? 32 : 0), 128, left_arm_overlay.width, left_arm_overlay.height);
        allCtx.drawImage(right_arm,     ((is_slim ? 32 : 0) + left_arm.width+body_front.width), 128, right_arm.width, right_arm.height);
        if (overlay) allCtx.drawImage(right_arm_overlay, ((is_slim ? 32 : 0) + left_arm.width+body_front.width), 128, right_arm_overlay.width, right_arm_overlay.height);
        


        return resize(all.toBuffer(), W, H);
    });
}