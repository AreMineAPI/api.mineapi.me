module.exports = function (text) {
    if (!text) return "";
    text = text.replace(/[çöğüşıİĞÜÖŞÇ]/g, function (a) {
        return {
            "ç": "c",
            "ö": "o",
            "ğ": "g",
            "ü": "u",
            "ş": "s",
            "ı": "i",
            "İ": "i",
            "Ü": "u",
            "Ö": "o",
            "Ç": "c",
            "Ş": "s"
        }[a];
    });

    text = text.replace(/&(.+);/g, "");
    text = text.replace(/[^a-zA-Z0-9\/:. ]/g, "");
    text = text.replace(/\s+/g, " ");

    if (text.charAt(0) === " ") text = text.substring(1);
    if (text.charAt(text.length - 1) === " ") text = text.substring(0, text.length - 1);

    return text;
}