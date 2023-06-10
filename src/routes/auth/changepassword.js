const Router = require("express").Router;
const router = new Router();
const _ = require("lodash");
const Accounts = require("../../database/models/account");
const isThisEmail = require("../../utils/isEmail");
const sha256 = require("../../utils/sha256");
const axios = require("axios");
const encoder = require("../../utils/encoder");

router.post("/auth/change-password", async (req, res) => {
    const Authorization = req.headers["authorization"];
    const { oldPassword, newPassword, newPasswordConfirm } = req.body;
    if (!oldPassword || !newPassword || !newPasswordConfirm)
        return res.json({
            success: false,
            errorId: "unknown",
            message: "Missing required fields.",
        });

    if (!Authorization)
        return res.json({
            success: false,
            errorId: "unknown",
            message: "User is not logged in.",
        });

    const Account = await Accounts.findOne({ token: Authorization }).select(
        "-_id password"
    );

    if (!Account)
        return res.json({
            success: false,
            errorId: "unknown",
            message: "User is not logged in.",
        });

    if (newPassword !== newPasswordConfirm)
        return res.json({
            success: false,
            errorId: "newPasswordConfirm",
            message: "New passwords do not match.",
        });

    if (Account.password === sha256(newPassword))
        return res.json({
            success: false,
            errorId: "newPassword",
            message: "New password is the same as old password.",
        });

    if (sha256(oldPassword) !== Account.password)
        return res.json({
            success: false,
            errorId: "oldPassword",
            message: "Old password is incorrect.",
        });

    const newToken = encoder({
        value: `${Account.id},${Account.username},${
            Account.email
        },${Date.now()}`,
        length: 64,
    });
    await Accounts.updateOne(
        {
            id: Account.id,
        },
        {
            $set: {
                token: newToken,
                password: sha256(newPassword),
            },
        }
    );

    res.json({
        success: true,
        message: "Password changed successfully.",
    });
});

module.exports = router;
