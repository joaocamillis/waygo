"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const jwt_1 = require("../utils/jwt");
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: 'Unauthorized' });
    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer')
        return res.status(401).json({ error: 'Unauthorized' });
    const token = parts[1];
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const payload = (0, jwt_1.verifyJwt)(token);
        req.userId = payload.userId || payload.sub || null;
        if (!req.userId)
            return res.status(401).json({ error: 'Unauthorized' });
        next();
    }
    catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
//# sourceMappingURL=authMiddleware.js.map