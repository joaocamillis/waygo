"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || 'change_this_secret';
const signJwt = (payload, options) => {
    return jsonwebtoken_1.default.sign(payload, SECRET, options);
};
exports.signJwt = signJwt;
const verifyJwt = (token) => {
    return jsonwebtoken_1.default.verify(token, SECRET);
};
exports.verifyJwt = verifyJwt;
//# sourceMappingURL=jwt.js.map