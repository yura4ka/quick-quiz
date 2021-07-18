const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const User = require('../models/User');
const requireAdmin = require('../../middleware/require_admin.middleware');

const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const userData = req.body;

        if (!userData.username)
            return res.status(400).json({ message: 'There must be an username in the request' });
        if (!userData.password)
            return res.status(400).json({ message: 'There must be a password in the request' });

        const user = await User.findOne({ username: userData.username });
        if (!user)
            return res.status(400).json({ message: 'Wrong user data' });

        if (! await bcrypt.compare(userData.password, user.password))
            return res.status(400).json({ message: 'Wrong user data' });

        if (!user.isAdmin)
            return res.status(400).json({ message: 'Wrong user data' });

        const token = jwt.sign(
            { username: user.username, isAdmin: user.isAdmin },
            JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.set('Access-Token', `${token}`);
        res.status(200).json({ message: 'ok' });
    } catch (e) {
        res.status(500).json(e);
    }
});

router.post('/check_admin', requireAdmin, (req, res) => {
    return res.status(200).json({ message: 'ok' });
});

module.exports = router;
