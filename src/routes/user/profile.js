const Router = require("express").Router;
const router = new Router();
const getProfile = require("../../utils/user/getProfile");

router.get("/user/:name/profile", (req, res) => {
    getProfile(req.params.name, String(req.query.external)).then((profile) => {
        if (!profile.error) {
            res.json({
                success: true,
                data: profile?.data,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
    });
});

module.exports = router;
