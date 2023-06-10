const router = require("express").Router();
const passport = require("passport");
var LocalStrategy = require("passport-local");
const config = require("../../config");
const Account = require("../../database/models/account");
const isThisEmail = require("../../utils/isEmail");
const sha256 = require("../../utils/sha256");

router.post("/auth/login", async (req, res) => {
    let { username, password } = req.body;
    let isEmail = isThisEmail(username);

    if (!username || !password)
        return res.json({
            success: false,
            errorId: "unknown",
            message: `${
                isEmail ? "Email" : "Username"
            } and password are required.`,
        });

    const query = isEmail ? { email: username } : { username: username };
    const account = await Account.findOne(query);
    try {
        if (!account)
            return res.json({
                success: false,
                errorId: "unknown",
                message: `${
                    isEmail ? "Email" : "Username"
                } or password is incorrect.`,
            });
        if (account.password !== sha256(password))
            return res.json({
                success: false,
                errorId: "unknown",
                message: `${
                    isEmail ? "Email" : "Username"
                } or password is incorrect.`,
            });

        req.session.token = account.token;

        return res.json({
            success: true,
            message: "Login successful.",
            data: {
                token: account.token,
            },
        });
    } catch (err) {
        console.log(err.message);
        res.json({
            success: false,
            errorId: "unknown",
            message: "Login failed.",
        });
    }
});

module.exports = router;
