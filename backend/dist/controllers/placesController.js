"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = exports.reverse = exports.autocomplete = void 0;
const geoapifyService_1 = __importDefault(require("../services/geoapifyService"));
const placeSuggestionService_1 = __importDefault(require("../services/placeSuggestionService"));
const autocomplete = async (req, res) => {
    try {
        const { input, lat, lng } = req.query;
        const userId = req.userId;
        if (!input || typeof input !== 'string') {
            return res.status(400).json({ error: 'Input is required' });
        }
        const suggestions = await placeSuggestionService_1.default.searchPlaces(userId, input, lat ? Number(lat) : undefined, lng ? Number(lng) : undefined);
        res.json({ suggestions });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Internal error' });
    }
};
exports.autocomplete = autocomplete;
const reverse = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'lat and lng are required' });
        }
        const result = await geoapifyService_1.default.reverseGeocode(Number(lat), Number(lng));
        res.json({ result });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Internal error' });
    }
};
exports.reverse = reverse;
const route = async (req, res) => {
    try {
        const { originLat, originLng, destinationLat, destinationLng } = req.query;
        if (!originLat || !originLng || !destinationLat || !destinationLng) {
            return res.status(400).json({ error: 'All coordinates are required' });
        }
        const result = await geoapifyService_1.default.routing(Number(originLat), Number(originLng), Number(destinationLat), Number(destinationLng));
        if (!result) {
            return res.status(400).json({ error: 'Could not calculate route' });
        }
        res.json({ result });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Internal error' });
    }
};
exports.route = route;
exports.default = { autocomplete: exports.autocomplete, reverse: exports.reverse, route: exports.route };
//# sourceMappingURL=placesController.js.map