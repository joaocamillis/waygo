import { Router } from 'express';
import * as rideController from '../controllers/rideController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/searches', authMiddleware, rideController.createSearch);
router.get('/searches', authMiddleware, rideController.getSearches);

export default router;
