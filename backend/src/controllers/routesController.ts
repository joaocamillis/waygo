import { Request, Response } from 'express';
import geoapifyService from '../services/geoapifyService';

export const carRoute = async (req: Request, res: Response) => {
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

    const result = await geoapifyService.routing(originLatN, originLngN, destinationLatN, destinationLngN);
    if (!result) return res.status(400).json({ error: 'Could not calculate route' });

    // Ensure numbers
    const distanceKm = Number(result.distanceKm ?? 0);
    const durationMin = Number(result.durationMin ?? 0);
    const coordinates = Array.isArray(result.coordinates)
      ? result.coordinates.map((p: any) => ({ latitude: Number(p.latitude), longitude: Number(p.longitude) }))
      : [];

    res.json({ distanceKm, durationMin, coordinates });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal error' });
  }
};

export default { carRoute };