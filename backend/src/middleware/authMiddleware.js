const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret_tr3');
        req.user = {
            id: payload.id,
            username: payload.username,
        };
        return next();
    } catch (_error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = {
    requireAuth,
};
