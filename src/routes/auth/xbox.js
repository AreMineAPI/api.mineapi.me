const router = require("express").Router();
const { default: axios } = require("axios");
const passport = require("passport");
const config = require("../../config");
const Account = require("../../database/models/account");
const Usernames = require("../../database/models/userNames");
const encoder = require("../../utils/encoder");
const getSkin = require("../../utils/user/getSkin");
var XboxStrategy = require("passport-minecraft").Strategy;

passport.use(
    new XboxStrategy(config.xbox, function (
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
    "/auth/minecraft",
    (req, res, next) => {
        if (req?.query?.code) return res.redirect("/v1/auth/minecraft");
        req.session.next = req.query.next || "/account";
        req.session.token = req.query.token || "qwe";
        req.session.save();
        next();
    },
    passport.authenticate("minecraft")
);

router.get(
    "/auth/minecraft/callback",
    passport.authenticate("minecraft", {
        failureRedirect: "/",
        session: false,
        prompt: "select_account",
    }),
    async function (req, res) {
        let next = req.session.next;
        let token = req.session.token;
        const username = await getSkin(req.user?.name);
        if (!next) return res.redirect("/v1/auth/minecraft?next=/");

        let account = await Account.findOne({ token });

        if (account) {
            const isClaimed = await Usernames.findOne({
                id: req.user?.id,
            }).select("claimed");

            if (isClaimed?.claimed || account?.claimed !== null) {
                res.redirect(config.websiteUrl + "/");
            } else {
                if (username) {
                    await Usernames.updateOne(
                        {
                            id: req.user?.id,
                        },
                        {
                            $set: {
                                claimer: account.id,
                                claimed: true,
                            },
                        }
                    );

                    const newToken = encoder({
                        value: `${account.id},${account.username},${
                            account.email
                        },${Date.now()}`,
                        length: 64,
                    });
                    await Account.updateOne(
                        {
                            token,
                        },
                        {
                            $set: {
                                token: newToken,
                                claimed: {
                                    id: req.user?.id,
                                    username: req.user?.name,
                                },
                            },
                        }
                    );

                    res.redirect(
                        config.websiteUrl +
                            "/auth/success?propmt=none&token=" +
                            newToken +
                            "&next=" +
                            next
                    );
                } else {
                    res.redirect(config.websiteUrl + "/");
                }
            }
        } else {
            res.redirect(config.websiteUrl + "/");
        }
    }
);

module.exports = router;
