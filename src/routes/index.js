const { default: axios } = require('axios');

const Router = require('express').Router;
const router = new Router();
const resize = require('../utils/canvas/resize');

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the MineAPI',
        fullName: "MineAPI - v1.0",
        version: "v1.0",
        authors: [
            { name: "clqu", email: "me@clqu.live" },
            { name: "Loiren", email: "loirenberk@gmail.com" }
        ],
        license: "MIT",
        routes: [
            { method: "GET", url: "/v1/user/<name>/uuid" },
            { method: "GET", url: "/v1/user/<uuid|name>/profile" },
            { method: "GET", url: "/v1/skin/<uuid|name|texture>" },
            { method: "GET", url: "/v1/cape/<uuid|name|texture>" },
            { method: "GET", url: "/v1/head/<uuid|name>" },
            { method: "GET", url: "/v1/bust/<uuid|name>" },
            { method: "GET", url: "/v1/body/<uuid|name>" },
            { method: "GET", url: "/v1/server/<ip>" },
            { method: "GET", url: "/v1/icon/<ip>" },
            { method: "GET", url: "/v1/motd/<ip>" },

        ]
    });
});

module.exports = router;