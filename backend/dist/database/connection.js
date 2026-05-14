"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString)
    throw new Error('DATABASE_URL is not set');
const useSSL = process.env.DATABASE_SSL === 'true' || connectionString.includes('sslmode=require') || process.env.NODE_ENV === 'production';
const pool = new pg_1.Pool({
    connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
});
exports.default = pool;
//# sourceMappingURL=connection.js.map