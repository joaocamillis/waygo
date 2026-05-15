import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import * as placesController from '../controllers/placesController';

const router = express.Router();

router.get('/autocomplete', authMiddleware, placesController.autocomplete);
router.get('/reverse', authMiddleware, placesController.reverse);
router.get('/route', authMiddleware, placesController.route);

export default router;
