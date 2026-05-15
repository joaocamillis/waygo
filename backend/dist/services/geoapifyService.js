"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routing = exports.reverseGeocode = exports.autocomplete = void 0;
const axios_1 = __importDefault(require("axios"));
const API_KEY = process.env.GEOAPIFY_API_KEY;
const BASE_URL = 'https://api.geoapify.com';
const client = axios_1.default.create({ baseURL: BASE_URL });
const autocomplete = async (input, lat, lng, lang = 'pt', limit = 5) => {
    if (!API_KEY)
        throw new Error('GEOAPIFY_API_KEY not set');
    const params = {
        text: input,
        apiKey: API_KEY,
        lang,
        limit,
        format: 'json',
        filter: 'countrycode:br',
    };
    if (lat !== undefined && lng !== undefined) {
        params.bias = `proximity:${lng},${lat}`;
    }
    try {
        const response = await client.get('/v1/geocode/autocomplete', { params });
        return response.data.results || [];
    }
    catch (error) {
        throw new Error(`Geoapify autocomplete failed: ${error.message}`);
    }
};
exports.autocomplete = autocomplete;
const reverseGeocode = async (lat, lng) => {
    if (!API_KEY)
        throw new Error('GEOAPIFY_API_KEY not set');
    const params = {
        lat,
        lon: lng,
        apiKey: API_KEY,
        format: 'json',
    };
    try {
        const response = await client.get('/v1/geocode/reverse', { params });
        const results = response.data.results || [];
        if (results.length === 0)
            return null;
        const result = results[0];
        return {
            latitude: lat,
            longitude: lng,
            address: result.formatted || `${lat}, ${lng}`,
            displayName: result.address_line1 || result.formatted,
        };
    }
    catch (error) {
        throw new Error(`Geoapify reverse geocode failed: ${error.message}`);
    }
};
exports.reverseGeocode = reverseGeocode;
const routing = async (originLat, originLng, destinationLat, destinationLng) => {
    var _a, _b, _c;
    if (!API_KEY)
        throw new Error('GEOAPIFY_API_KEY not set');
    const params = {
        apiKey: API_KEY,
        mode: 'drive',
        format: 'json',
    };
    const waypoints = `${originLat},${originLng}|${destinationLat},${destinationLng}`;
    try {
        const response = await client.get(`/v1/routing?waypoints=${waypoints}`, { params });
        const routes = response.data.routes || [];
        if (routes.length === 0)
            return null;
        const route = routes[0];
        const distanceKm = (route.distance || 0) / 1000;
        const durationMin = Math.round((route.time || 0) / 60);
        const geometry = ((_c = (_b = (_a = route.legs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.steps) === null || _c === void 0 ? void 0 : _c.map((s) => s.points || []).flat()) || null;
        return { distanceKm: Number(distanceKm.toFixed(2)), durationMin, geometry };
    }
    catch (error) {
        throw new Error(`Geoapify routing failed: ${error.message}`);
    }
};
exports.routing = routing;
exports.default = { autocomplete: exports.autocomplete, reverseGeocode: exports.reverseGeocode, routing: exports.routing };
//# sourceMappingURL=geoapifyService.js.map