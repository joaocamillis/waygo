"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearches = exports.createSearch = void 0;
const rideService = __importStar(require("../services/rideService"));
const zod_1 = require("zod");
const searchSchema = zod_1.z.object({
    originLat: zod_1.z.number(),
    originLng: zod_1.z.number(),
    originAddress: zod_1.z.string().optional(),
    destinationLat: zod_1.z.number(),
    destinationLng: zod_1.z.number(),
    destinationAddress: zod_1.z.string().optional(),
    distanceKm: zod_1.z.number().optional(),
    durationMin: zod_1.z.number().optional(),
    selectedProvider: zod_1.z.string().nullable().optional(),
});
const createSearch = async (req, res) => {
    const userId = req.userId;
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const data = searchSchema.parse(req.body);
        const created = await rideService.createSearch(userId, data);
        res.status(201).json(created);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError)
            return res.status(400).json({ errors: error.issues });
        return res.status(500).json({ error: 'Internal error' });
    }
};
exports.createSearch = createSearch;
const getSearches = async (req, res) => {
    const userId = req.userId;
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const items = await rideService.listSearches(userId);
        res.json(items);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal error' });
    }
};
exports.getSearches = getSearches;
//# sourceMappingURL=rideController.js.map