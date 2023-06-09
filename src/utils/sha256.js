const crypto = require("crypto");

module.exports = (value) => {
    const hash = crypto.createHash("sha256");
    hash.update(value);
    return hash.digest("hex");
};
