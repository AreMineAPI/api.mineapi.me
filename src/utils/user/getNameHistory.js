const { default: axios } = require("axios");
const getUUID = require("./getUUID");
const isUUID = require("./isUUID");

module.exports = async (name) => {
    let status;
    let uuid = name;
    if (!isUUID(name)) uuid = await getUUID(name);
    if (uuid === null) return { error: true, message: "Player not found" };

    const request = await axios({
        method: "GET",
        url: `https://api.mojang.com/user/profiles/${uuid}/names`,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            status = true;
        });

    if (status) return { error: true, message: "Player not found" };

    if (request.error) {
        return { error: true, message: "Player not found" };
    } else {
        return {
            error: false,
            id: "nameHistory",
            data: request,
        };
    }
};
