const Router = require("express").Router;
const router = new Router();
const _ = require("lodash");
const Account = require("../../database/models/account");
const encoder = require("../../utils/encoder");
const isEmail = require("../../utils/isEmail");
const sha256 = require("../../utils/sha256");
const Encoder = require("../../utils/encoder");

router.post("/auth/register", (req, res) => {
    let { username, password, email, passwordConfirm } = req.body;
    if (!username || !password || !email)
        return res.json({
            success: false,
            errorId: "unknown",
            message: "Username, password and email are required.",
        });

    if (username.length < 3 || username.length > 32)
        return res.json({
            success: false,
            errorId: "username",
            message: "Username must be between 3 and 32 characters.",
        });

    if (!isEmail(email))
        return res.json({
            success: false,
            errorId: "email",
            message: "Email is invalid.",
        });

    if (password.length < 8 || password.length > 32)
        return res.json({
            success: false,
            errorId: "password",
            message: "Password must be between 8 and 32 characters.",
        });

    if (password !== passwordConfirm)
        return res.json({
            success: false,
            errorId: "password",
            message: "Passwords do not match.",
        });

    Account.findOne({ $or: [{ username }, { email }] }).then((account) => {
        if (account)
            return res.json({
                success: false,
                errorId: "unknown",
                message: "Username or email already exists.",
            });
    });

    let accId = _.random(0, 999999999999999999).toString();
    const token = encoder({
        value: `${accId},${username},${email},${Date.now()}`,
        length: 64,
    });

    new Account({
        id: accId,
        username: username,
        password: sha256(password),
        email: email,
        token: token,
    })
        .save()
        .then((account) => {
            return res.json({
                success: true,
                message: "Registration successful.",
                data: {
                    token: token,
                },
            });
        })
        .catch((err) => {
            return res.json({
                success: false,
                message: "Registration failed.",
            });
        });
});

module.exports = router;
