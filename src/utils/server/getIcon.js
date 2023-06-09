const { default: axios } = require("axios");
const { baseUrl } = require("../../config.js");
const Servers = require("../../database/models/servers");
const Cleaner = require("../cleaner");

module.exports = async (server) => {
    let status = false;

    const request = await axios({
        method: "GET",
        url: `https://api.mcsrvstat.us/2/${server}`,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.data)
        .catch((err) => {
            status = true;
        });

    if (status) return { error: true, message: "Server not found." };
    if (!request) return { error: true, message: "Server not found." };
    if (request.debug.ping == false)
        return { error: true, message: "Server not found." };

    const cleanText1 = Cleaner(request.motd.clean?.[0]);
    const cleanText2 = Cleaner(request.motd.clean?.[1]);

    await Servers.updateOne(
        { hostname: request.hostname },
        {
            $set: {
                ip: request.ip,
                motd: {
                    clean: [cleanText1, cleanText2],
                    html: request.motd.html,
                },
                onlinePlayers: request.players.online,
                maxPlayers: request.players.max,
                version: request.version,
            },
        },
        { upsert: true }
    );

    return {
        error: false,
        data: request.icon,
    };
};
