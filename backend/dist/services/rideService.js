"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSearches = exports.createSearch = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const crypto_1 = require("crypto");
const createSearch = async (userId, data) => {
    var _a, _b, _c;
    const id = (0, crypto_1.randomUUID)();
    const { rows } = await connection_1.default.query(`INSERT INTO ride_searches
      (id, user_id, origin_lat, origin_lng, origin_address, destination_lat, destination_lng, destination_address, distance_km, duration_min, selected_provider)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`, [
        id,
        userId,
        data.originLat,
        data.originLng,
        data.originAddress || null,
        data.destinationLat,
        data.destinationLng,
        data.destinationAddress || null,
        (_a = data.distanceKm) !== null && _a !== void 0 ? _a : null,
        (_b = data.durationMin) !== null && _b !== void 0 ? _b : null,
        (_c = data.selectedProvider) !== null && _c !== void 0 ? _c : null,
    ]);
    return rows[0];
};
exports.createSearch = createSearch;
const listSearches = async (userId) => {
    const { rows } = await connection_1.default.query('SELECT * FROM ride_searches WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return rows;
};
exports.listSearches = listSearches;
//# sourceMappingURL=rideService.js.map