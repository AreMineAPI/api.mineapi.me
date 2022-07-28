const Router = require('express').Router;
const router = new Router();
const { Achievement } = require('@mineapi/achievements');
const axios = require('axios');

router.get('/achievement/icons', async (req, res) => {
    res.send(Achievement.getIcons());
});

router.get('/achievement/generator', async (req, res) => {
    const { title, description, icon } = req.query;

    if (!title) return res.json({ success: false, message: 'Title is required' });
    if (!description) return res.json({ success: false, message: 'Description is required' });
    if (!icon) return res.json({ success: false, message: 'Icon is required' });

    try {
        const achievement = new Achievement({ title, description, icon });

        const image = await achievement.create();
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'filename="achievement.png"');

        res.end(image);

    } catch (e) {
        res.json({ success: false, message: e.message });
    }
});

module.exports = router;