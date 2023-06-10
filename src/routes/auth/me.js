const Router = require("express").Router;
const router = new Router();
const _ = require("lodash");
const Accounts = require("../../database/models/account");
const isThisEmail = require("../../utils/isEmail");
const sha256 = require("../../utils/sha256");
const axios = require("axios");

router.get("/auth/@me", async (req, res) => {
    const Authorization = req.headers["authorization"];

    if (!Authorization)
        return res.json({
            success: false,
            errorId: "unknown",
            message: "User is not logged in.",
        });

    const Account = await Accounts.findOne({ token: Authorization }).select(
        "-_id -password"
    );

    res.json({
        success: true,
        data: Account,
    });
});

module.exports = router;
