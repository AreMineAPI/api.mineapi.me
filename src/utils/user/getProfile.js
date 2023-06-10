const { default: axios } = require("axios");
const getName = require("./getName");
const getNameHistory = require("./getNameHistory");
const isUUID = require("./isUUID");
const { baseUrl } = require("../../config");
const Database = require("../../database/models/userNames");
const averageColor = require("../canvas/getAverage");

module.exports = async (name, external = "") => {
    const profile = await getName(name);
    if (profile.error) return { error: true, message: "Player not found" };

    let searchParam = name;
    let status;

    if (!isUUID(name)) searchParam = profile.data.id;

    const request = await axios({
        method: "GET",
        url: `https://sessionserver.mojang.com/session/minecraft/profile/${searchParam}`,
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
        return null;
    } else {
        const data = JSON.parse(
            Buffer.from(request.properties[0].value, "base64").toString("ascii")
        );
        const findUser = await Database.findOne({ id: data.profileId }).select(
            "-_id"
        );
        const colorAverage = await averageColor(data.textures.SKIN.url);
        if (!findUser) {
            new Database({
                id: data.profileId,
                name: data.profileName,
                downloads: 0,
                isSlim:
                    data?.textures.SKIN?.metadata?.model === "slim"
                        ? true
                        : false,
                texture:
                    data.textures.SKIN.url.split("/")[
                        data.textures.SKIN.url.split("/").length - 1
                    ],
                color: colorAverage,
                claimed: false,
                claimer: null,
            }).save();
        } else {
            await Database.updateOne(
                {
                    id: data.profileId,
                },
                {
                    $set: {
                        name: data.profileName,
                        isSlim:
                            data?.textures.SKIN?.metadata?.model === "slim"
                                ? true
                                : false,
                        texture:
                            data.textures.SKIN.url.split("/")[
                                data.textures.SKIN.url.split("/").length - 1
                            ],
                        claimer: findUser.claimer || null,
                        claimed: findUser.claimed || false,
                    },
                }
            );
        }

        let responseData = {
            id: data.profileId,
            name: data.profileName,
            appereance: {
                skin: {
                    texture:
                        data.textures.SKIN.url.split("/")[
                            data.textures.SKIN.url.split("/").length - 1
                        ],
                    url: baseUrl + "/skin/" + data.profileName,
                    slim:
                        data?.textures.SKIN?.metadata?.model === "slim"
                            ? true
                            : false,
                    colorAverage: colorAverage,
                },
                cape: {
                    texture: data.textures?.CAPE
                        ? data.textures.CAPE.url.split("/")[
                              data.textures.CAPE.url.split("/").length - 1
                          ]
                        : null,
                    url: data.textures?.CAPE
                        ? baseUrl + "/cape/" + data.profileName
                        : null,
                },
                otherCapes: undefined,
            },
            nameHistory: undefined,
            downloads: findUser ? findUser?.downloads || 0 : 0,
            claimed: findUser ? findUser?.claimed || false : false,
            claimer: findUser ? findUser?.claimer || null : null,
        };

        let nameHistory;
        if (external && String(external).length > 0) {
            let externals = external.split(",");
            (
                await Promise.all(
                    externals.filter(Boolean).map((external) => {
                        if (external === "nameHistory") {
                            return getNameHistory(name);
                        }
                        if (external === "minecraftCapes") {
                            return axios
                                .get(
                                    "https://www.minecraftcapes.co.uk/getCape.php?u=" +
                                        name
                                )
                                .then((response) => {
                                    if (response.status === 404) {
                                        return {
                                            id: "minecraftCapes",
                                            status: false,
                                        };
                                    } else {
                                        return {
                                            id: "minecraftCapes",
                                            status: true,
                                        };
                                    }
                                })
                                .catch(() => ({
                                    id: "minecraftCapes",
                                    status: false,
                                }));
                        }

                        if (external === "optifine") {
                            return axios
                                .get(
                                    "http://s.optifine.net/capes/" +
                                        name +
                                        ".png"
                                )
                                .then((response) => {
                                    if (response.status === 404) {
                                        return {
                                            id: "optifine",
                                            status: false,
                                        };
                                    } else {
                                        return { id: "optifine", status: true };
                                    }
                                })
                                .catch(() => ({
                                    id: "optifine",
                                    status: false,
                                }));
                        }
                    })
                )
            ).forEach((data) => {
                if (data?.id === "nameHistory") {
                    responseData.nameHistory = data.data;
                }
                if (data?.id === "minecraftCapes") {
                    if (!responseData.appereance.otherCapes)
                        responseData.appereance.otherCapes = [];
                    if (
                        typeof responseData.appereance.otherCapes ===
                        "undefined"
                    )
                        responseData.appereance.otherCapes = [];
                    responseData.appereance.otherCapes.push(
                        data?.status
                            ? {
                                  id: "minecraftCapes",
                                  url:
                                      "https://www.minecraftcapes.co.uk/getCape.php?u=" +
                                      name,
                              }
                            : { id: "optifine", url: null }
                    );
                }
                if (data?.id === "optifine") {
                    if (!responseData.appereance.otherCapes)
                        responseData.appereance.otherCapes = [];
                    if (
                        typeof responseData.appereance.otherCapes ===
                        "undefined"
                    )
                        responseData.appereance.otherCapes = [];
                    responseData.appereance.otherCapes.push(
                        data?.status
                            ? {
                                  id: "optifine",
                                  url:
                                      "http://s.optifine.net/capes/" +
                                      name +
                                      ".png",
                              }
                            : { id: "optifine", url: null }
                    );
                }
            });
        }

        return {
            error: false,
            data: await responseData,
        };
    }
};
