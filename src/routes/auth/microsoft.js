const router = require("express").Router();
const { default: axios } = require("axios");
const passport = require("passport");
const config = require("../../config");
const Account = require("../../database/models/account");
const encoder = require("../../utils/encoder");
var MicrosoftStrategy = require("passport-microsoft").Strategy;

passport.use(
    new MicrosoftStrategy(config.microsoft, function (
        accessToken,
        refreshToken,
        profile,
        done
    ) {
        return done(null, {
            ...profile,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    })
);

router.get(
    "/auth/microsoft",
    (req, res, next) => {
        if (req?.query?.code) return res.redirect("/v1/auth/microsoft");
        req.session.next = req.query.next || "/";
        req.session.save();
        next();
    },
    passport.authenticate("microsoft")
);

router.get(
    "/auth/microsoft/callback",
    passport.authenticate("microsoft", {
        failureRedirect: "/",
        session: false,
        prompt: "select_account",
    }),
    async function (req, res) {
        const user = req.user;
        const avatar = await axios
            .get("https://graph.microsoft.com/v1.0/me/photo/$value", {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                    "Content-Type": "image/jpeg",
                },
                responseType: "arraybuffer",
            })
            .then((response) => response.data)
            .catch(() => {});

        let next = await req.session.next;
        if (!next) return res.redirect("/v1/auth/microsoft?next=/");
        if (!user?._json.userPrincipalName)
            return res.redirect("/v1/auth/microsoft?next=/");

        let account = await Account.findOne({
            email: user?._json.userPrincipalName,
        });
        let username = user.displayName.replace(/[^0-9a-zA-Z ]/g, "");

        const newToken = account
            ? encoder({
                  value: `${account.id},${account.username},${
                      account.email
                  },${Date.now()}`,
                  length: 64,
              })
            : null;
        const data = {
            provider: "microsoft",
            isRegistered: account ? true : false,
            username: username,
            email: user?._json.userPrincipalName,
            token: newToken,
            account: {
                id: req.user.id,
                username: username,
                avatar: "qweqwe",
            },
        };

        if (data.isRegistered) {
            account.token = newToken;
            account.save();
        }

        res.redirect(
            config.websiteUrl +
                "/auth/success?t=" +
                Buffer.from(JSON.stringify(data)).toString("base64")
        );
    }
);

module.exports = router;
