"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const routesController_1 = __importDefault(require("../controllers/routesController"));
const router = express_1.default.Router();
router.get('/car', authMiddleware_1.default, routesController_1.default.carRoute);
exports.default = router;
//# sourceMappingURL=routeRoutes.js.map