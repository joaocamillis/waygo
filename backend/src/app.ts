import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/authRoutes';
import rideRoutes from './routes/rideRoutes';
import placesRoutes from './routes/placesRoutes';
import routeRoutes from './routes/routeRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/rides', rideRoutes);
app.use('/places', placesRoutes);
app.use('/routes', routeRoutes);

app.get('/', (_, res) => res.json({ ok: true }));
app.get('/health', (_, res) => res.json({ status: 'ok' }));

export default app;
