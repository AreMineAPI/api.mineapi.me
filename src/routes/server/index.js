const Router = require('express').Router;
const router = new Router();
const getServer = require('../../utils/server/getServer');

router.get('/server/:ip', (req, res) => {
    let ip = encodeURIComponent(req.params.ip);
    getServer(ip).then(server => {
        if (!server.error) {
            res.json({
                success: true,
                data: server?.data
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Server not found"
            });
        }
    });
});

module.exports = router;