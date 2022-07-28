const { text } = require("express");
const getProfile = require("./getProfile");
const isTexture = require("./isTexture");
const isUUID = require("./isUUID");

module.exports = async value => {
    let texture = value;
    let isSlim = false;
    if (isTexture(value)) {
        texture = value;
    } else {
        const profile = await getProfile(value);
        if (profile.error) return { error: true, message: "Profile not found." };

        texture = profile.data.appereance.skin.texture;
        isSlim = profile.data.appereance.skin.slim;
    }
    return {
        error: false,
        is_slim: isSlim,
        data: texture
    }
}