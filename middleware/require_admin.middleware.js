const jwt = require('jsonwebtoken');
const config = require('config');

const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') return next();

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            console.log('!token');
            return res.status(401).json({ message: 'forbidden' });
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        if (!decoded.isAdmin)
            return res.status(401).json({ message: 'forbidden' });

        return next();
    } catch (e) {
        return res.status(401).json(e);
    }
};
