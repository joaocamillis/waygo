"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.login = exports.register = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const crypto_1 = require("crypto");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const register = async (name, email, password) => {
    const existing = await connection_1.default.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount && existing.rowCount > 0)
        throw { status: 400, message: 'Email already in use' };
    const id = (0, crypto_1.randomUUID)();
    const password_hash = await (0, password_1.hashPassword)(password);
    const { rows } = await connection_1.default.query('INSERT INTO users (id, name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING id, name, email, created_at', [id, name, email, password_hash]);
    const user = rows[0];
    const token = (0, jwt_1.signJwt)({ userId: user.id });
    return { user, token };
};
exports.register = register;
const login = async (email, password) => {
    const { rows } = await connection_1.default.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user)
        throw { status: 401, message: 'Invalid credentials' };
    const valid = await (0, password_1.comparePassword)(password, user.password_hash);
    if (!valid)
        throw { status: 401, message: 'Invalid credentials' };
    const token = (0, jwt_1.signJwt)({ userId: user.id });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
};
exports.login = login;
const getUserById = async (id) => {
    const { rows } = await connection_1.default.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    return rows[0] || null;
};
exports.getUserById = getUserById;
//# sourceMappingURL=authService.js.map