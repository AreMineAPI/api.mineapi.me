const { createCanvas, loadImage, registerFont } = require("canvas");
const resize = require("./resize");
const removeTransparency = require("./removeTransparency");
const getPart = require("./getPart");
const roundImage = require("./roundImage");
const path = require("path");

function cleanText(text) {
    // Remove all non-alphanumeric characters without /, : . and spaces
    // Remove html characters

    if (!text) return "";
    text = text.replace(/[çöğüşıİĞÜÖŞÇ]/g, function (a) {
        return {
            ç: "c",
            ö: "o",
            ğ: "g",
            ü: "u",
            ş: "s",
            ı: "i",
            İ: "i",
            Ü: "u",
            Ö: "o",
            Ç: "c",
            Ş: "s",
        }[a];
    });

    text = text.replace(/&(.+);/g, "");
    text = text.replace(/[^a-zA-Z0-9\/:. ]/g, "");
    text = text.replace(/\s+/g, " ");

    // replace first
    if (text.charAt(0) === " ") text = text.substring(1);
    if (text.charAt(text.length - 1) === " ")
        text = text.substring(0, text.length - 1);

    return text;
}

module.exports = (background, icon, data) => {
    return loadImage(background).then(async (bg) => {
        const canvas = createCanvas(980, 135);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(bg, 0, 0, 1920, 1080);
        ctx.scale(2, 2);
        ctx.patternQuality = "fast";

        const serverIcon = await loadImage(icon);
        ctx.save();
        roundImage(ctx, 9, 9, 50, 50, 10);
        ctx.clip();
        ctx.drawImage(serverIcon, 9, 9, 50, 50);
        ctx.restore();

        registerFont("./src/fonts/Minecraftia.ttf", { family: "Minecraft" });

        ctx.font = "8px Minecraft";
        ctx.fillStyle = "#dddd";
        ctx.fillText(data?.hostname || data?.ip, 65, 25);

        let placement = 430;
        if (data?.players?.online + data.players.max < 1000) placement = 460;
        if (data?.players?.online + data.players.max >= 10000) placement = 430;
        if (data?.players?.online + data.players.max > 100000) placement = 410;

        ctx.font = "8px Minecraft";
        ctx.fillStyle = "#ffff";
        ctx.fillText(
            `${data.players.online}/${data.players.max}`,
            placement,
            25
        );

        const motdText = data.motd.clean?.[0];
        ctx.font = "8px";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(cleanText(motdText), 65, 40);

        const motdText2 = data.motd.clean?.[1];
        ctx.font = "8px";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(cleanText(motdText2), 65, 50);

        return canvas.toBuffer();
    });
};
