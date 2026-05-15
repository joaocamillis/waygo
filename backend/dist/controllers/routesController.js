"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carRoute = void 0;
const geoapifyService_1 = __importDefault(require("../services/geoapifyService"));
const carRoute = async (req, res) => {
    var _a, _b;
    try {
        const { originLat, originLng, destinationLat, destinationLng } = req.query;
        if (!originLat || !originLng || !destinationLat || !destinationLng) {
            return res.status(400).json({ error: 'All coordinates are required' });
        }
        const originLatN = Number(originLat);
        const originLngN = Number(originLng);
        const destinationLatN = Number(destinationLat);
        const destinationLngN = Number(destinationLng);
        if ([originLatN, originLngN, destinationLatN, destinationLngN].some(v => !Number.isFinite(v))) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }
        const result = await geoapifyService_1.default.routing(originLatN, originLngN, destinationLatN, destinationLngN);
        if (!result)
            return res.status(400).json({ error: 'Could not calculate route' });
        // Ensure numbers
        const distanceKm = Number((_a = result.distanceKm) !== null && _a !== void 0 ? _a : 0);
        const durationMin = Number((_b = result.durationMin) !== null && _b !== void 0 ? _b : 0);
        const coordinates = Array.isArray(result.coordinates)
            ? result.coordinates.map((p) => ({ latitude: Number(p.latitude), longitude: Number(p.longitude) }))
            : [];
        res.json({ distanceKm, durationMin, coordinates });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Internal error' });
    }
};
exports.carRoute = carRoute;
exports.default = { carRoute: exports.carRoute };
//# sourceMappingURL=routesController.js.map