import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import routesController from '../controllers/routesController';

const router = express.Router();

router.get('/car', authMiddleware, routesController.carRoute);

export default router;
