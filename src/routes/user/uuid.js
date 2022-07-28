const Router = require('express').Router;
const router = new Router();
const getUUID = require('../../utils/user/getUUID');

router.get('/user/:name/uuid', (req, res) => {
   getUUID(req.params.name).then(uuid => {
        if (uuid !== null) {
            res.json({
                success: true,
                data: {
                    id: uuid,
                    name: req.params.name
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Player not found."
            });
        }
    });
});

module.exports = router;