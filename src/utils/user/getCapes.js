const { text } = require("express");
const getProfile = require("./getProfile");
const isTexture = require("./isTexture");
const isUUID = require("./isUUID");

module.exports = async (value, type) => {
    let texture = value;
    let otherCapes = [];
    if (isTexture(value)) {
        texture = value;
    } else {
        const profile = await getProfile(value, "optifine,minecraftCapes");
        
        if (profile.error) return { error: true, message: "Profile not found." };
        if (type === "mojang" && profile.data.appereance.cape.url === null) return { error: true, message: "Player has no cape." };
        if (type === "optifine" && profile.data.appereance.otherCapes.find(cape => cape.id === "optifine")?.url === null) return { error: true, message: "Player has no cape." };
        if (type === "minecraftCapes" && profile.data.appereance.otherCapes.find(cape => cape.id === "minecraftCapes")?.url === null) return { error: true, message: "Player has no cape." };

        texture = profile.data.appereance.cape.texture;
        otherCapes = profile.data.appereance.otherCapes;
    }
    return {
        error: false,
        data: {
            mojang: texture,
            optifine: otherCapes.find(cape => cape.id === "optifine")?.url,
            minecraftcapes: otherCapes.find(cape => cape.id === "minecraftCapes")?.url,
        }
    }
}