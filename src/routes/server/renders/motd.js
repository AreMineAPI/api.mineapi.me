const Router = require('express').Router;
const router = new Router();

const axios = require('axios');
const motdView = require('../../../utils/canvas/motdView');

const resize = require('../../../utils/canvas/resize');
const getIcon = require('../../../utils/server/getIcon');
const getServer = require('../../../utils/server/getServer');

router.get('/motd/:value', async (req, res) => {
    const icon = await getIcon(encodeURIComponent(req.params.value));
    const serverData = await getServer(encodeURIComponent(req.params.value));

    let data;
    let serverIcon;
    if (serverData.error) {
        data = {
            hostname: "Server not found or offline.",
            players: {
                online: 0,
                max: 0
            },
            motd: {
                clean: [
                    "Please check the server IP.",
                    "More info: https://mineapi.me/",
                ]
            }
        }
        serverIcon = "https://i.imgur.com/ynER8Tt.png";
    } else {
        data = serverData.data;
        serverIcon = icon.data;
    }

    axios.get("https://i.imgur.com/dbWgAoW.png", {
        responseType: 'arraybuffer'
    }).then(async response => {
        const Motd = await motdView(response.data, serverIcon, data);
        const resizedIcon = await resize(Motd, 1400, 200);
        res.end(Motd);
    });
});

module.exports = router;