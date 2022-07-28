const Router = require('express').Router;
const router = new Router();
const Skins = require('../database/models/userNames');
const Servers = require('../database/models/servers');
const getSkin = require('../utils/user/getSkin');

router.get('/all/skins', async (req, res) => {
    let { page, limit, q, sort } = req.query;
    if (!page)  page = 1;
    if (!limit) limit = 12;

    if (!sort) {
        sort = "downloads";
    }
    if (!q) {
        q = "";
    }
    if (q?.trim()?.length > 0) await getSkin(q?.trim());

    setTimeout(async () => {
        if (isNaN(page) || isNaN(limit)) return res.status(400).json({
            success: false,
            message: "Page and limit must be number."
        });
    
        if (!["downloads", "updatedAt", "createdAt"].includes(sort)) return res.status(400).json({
            success: false,
            message: "Sort must be one of these: downloads, updatedAt, createdAt."
        });
    
        const skins = await Skins.find({
            name: {
                $regex: q,
                $options: 'i'
            }
        }, { _id: 0 }).sort({
            [sort]: -1
        }).skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
    
        const total = await Skins.countDocuments({ name: { $regex: q, $options: 'i' } });
        const pages = Math.ceil(total / Number(limit));
    
        res.json({
            success: true,
            data: {
                searchParams: {
                    page: Number(page),
                    limit: Number(limit),
                    q: q === "" ? undefined : q,
                    sort,
                    max_page: pages,
                    total_results: total
                },
                data: skins
            }
        });
    }, q?.trim()?.length > 0 ? 100 : 0);
});

router.get('/all/servers', async (req, res) => {
    let { page, limit, q, sort } = req.query;
    if (!page || !limit) {
        page = 1;
        limit = 12;
    }
    if (!sort) {
        sort = "onlinePlayers";
    }
    if (!q) {
        q = "";
    }
    if (isNaN(page) || isNaN(limit)) return res.status(400).json({
        success: false,
        message: "Page and limit must be number."
    });

    if (!["onlinePlayers", "updatedAt", "createdAt"].includes(sort)) return res.status(400).json({
        success: false,
        message: "Sort must be one of these: updatedAt, onlinePlayers, createdAt."
    });

    const servers = await Servers.find({
        hostname: {
            $regex: q,
            $options: 'i'
        }
    }, { _id: 0 }).sort({
        [sort]: -1
    }).skip((page - 1) * limit).limit(limit);

    const total = await Servers.countDocuments({ name: { $regex: q, $options: 'i' } });
    const pages = Math.ceil(total / limit);

    res.json({
        success: true,
        data: {
            searchParams: {
                page,
                limit,
                q: q === "" ? undefined : q,
                sort,
                max_page: pages,
                total_results: total
            },
            data: servers
        }
    });
});

module.exports = router;