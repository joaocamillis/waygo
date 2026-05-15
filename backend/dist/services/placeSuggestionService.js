"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaceDetails = exports.searchPlaces = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const geoapifyService_1 = __importDefault(require("./geoapifyService"));
const getRecentDestinations = async (userId, limit) => {
    try {
        const { rows } = await connection_1.default.query(`SELECT DISTINCT ON (destination_address) destination_address, destination_lat, destination_lng 
       FROM ride_searches 
       WHERE user_id = $1 AND destination_address IS NOT NULL 
       ORDER BY destination_address, created_at DESC 
       LIMIT $2`, [userId, limit]);
        return rows.map((r, i) => ({
            placeId: `history_${i}`,
            displayName: r.destination_address,
            address: r.destination_address,
            latitude: r.destination_lat,
            longitude: r.destination_lng,
            source: 'history',
        }));
    }
    catch (error) {
        return [];
    }
};
const searchPlaces = async (userId, input, lat, lng) => {
    if (!input || input.trim().length < 2)
        return [];
    const historySuggestions = await getRecentDestinations(userId, 3);
    const filtered = historySuggestions.filter((h) => h.displayName.toLowerCase().includes(input.toLowerCase()));
    const geoapifySuggestions = [];
    try {
        const results = await geoapifyService_1.default.autocomplete(input, lat, lng, 'pt', 5);
        geoapifySuggestions.push(...results.map((result, i) => ({
            placeId: `geoapify_${result.place_id || i}`,
            displayName: result.address_line1 || result.formatted,
            address: result.formatted || result.address_line1,
            latitude: result.lat,
            longitude: result.lon,
            source: 'geoapify',
        })));
    }
    catch (error) {
        // fallback: return only history
    }
    // priority: history first, then geoapify
    const combined = [...filtered, ...geoapifySuggestions];
    return combined.slice(0, 8); // limit total to 8 suggestions
};
exports.searchPlaces = searchPlaces;
const getPlaceDetails = async (placeId) => {
    if (placeId.startsWith('history_')) {
        // For history suggestions, we already have all the details
        // This is mainly for consistency; ideally already cached on client.
        return null;
    }
    if (placeId.startsWith('geoapify_')) {
        // For Geoapify suggestions, we'd need to fetch from Geoapify again
        // For now, this is a placeholder as we cache on client
        return null;
    }
    return null;
};
exports.getPlaceDetails = getPlaceDetails;
exports.default = { searchPlaces: exports.searchPlaces, getPlaceDetails: exports.getPlaceDetails };
//# sourceMappingURL=placeSuggestionService.js.map