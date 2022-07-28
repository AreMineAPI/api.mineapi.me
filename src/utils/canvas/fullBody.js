const { createCanvas, loadImage } = require('canvas');
const first = require('./skin/64x64');
const second = require('./skin/64x32');
const firstBack = require('./skin/64x64Back');
const secondBack = require('./skin/64x32Back');

module.exports = (src, W, H, is_slim = false, overlay = true, showBack = false) => {
    return loadImage(src).then(async image => {
        if (image.height === 64) {
            if (showBack) return firstBack(src, W, H, is_slim, overlay);
            return first(src, W, H, is_slim, overlay);
        } else if (image.height === 32) {
            if (showBack) return secondBack(src, W, H, is_slim, overlay);
            return second(src, W, H, is_slim, overlay);
        }
    });
}