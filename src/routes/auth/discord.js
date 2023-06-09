const router = require("express").Router();
const passport = require("passport");
var DiscordStrategy = require("passport-discord").Strategy;
const config = require("../../config");
const Account = require("../../database/models/account");
const encoder = require("../../utils/encoder");

passport.use(
    new DiscordStrategy(
        {
            clientID: config.discordClient.id,
            clientSecret: config.discordClient.secret,
            callbackURL: config.discordClient.callback,
            scope: ["email", "identify", "guilds.join"],
        },
        function (accessToken, refreshToken, profile, cb) {
            cb(null, profile);
        }
    )
);

router.get(
    "/auth/discord",
    (req, res, next) => {
        if (req?.query?.code) return res.redirect("/v1/auth/discord");
        req.session.next = req.query.next || "/";
        req.session.save();
        next();
    },
    passport.authenticate("discord")
);

router.get(
    "/auth/discord/callback",
    passport.authenticate("discord", {
        failureRedirect: "/",
        session: false,
    }),
    async function (req, res) {
        try {
            axios({
                url: `https://discordapp.com/api/v8/guilds/999355278283771974/members/${req.user.id}`,
                method: "PUT",
                data: {
                    access_token: req.user.accessToken,
                },
                headers: {
                    Authorization: `Bot ${bot.token}`,
                    "Content-Type": "application/json",
                },
            }).catch(() => {});
        } catch {}

        let next = await req.session.next;

        if (!next) return res.redirect("/v1/auth/discord?next=/");
        if (!req.user.email) return res.redirect("/v1/auth/discord?next=/");

        let account = await Account.findOne({ email: req.user.email });
        const newToken = account
            ? encoder({
                  value: `${account.id},${account.username},${
                      account.email
                  },${Date.now()}`,
                  length: 64,
              })
            : null;

        const data = {
            provider: "discord",
            isRegistered: account ? true : false,
            username: req.user.username,
            token: newToken,
            email: req.user.email,
            account: {
                id: req.user.id,
                username: req.user.username + "#" + req.user.discriminator,
                avatar:
                    "https://cdn.discordapp.com/avatars/" +
                    req.user.id +
                    "/" +
                    req.user.avatar +
                    ".png",
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
