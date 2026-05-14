import { Request, Response } from 'express';
import * as rideService from '../services/rideService';
import { z } from 'zod';

const searchSchema = z.object({
  originLat: z.number(),
  originLng: z.number(),
  originAddress: z.string().optional(),
  destinationLat: z.number(),
  destinationLng: z.number(),
  destinationAddress: z.string().optional(),
  distanceKm: z.number().optional(),
  durationMin: z.number().optional(),
  selectedProvider: z.string().nullable().optional(),
});

export const createSearch = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const data = searchSchema.parse(req.body);
    const created = await rideService.createSearch(userId, data);
    res.status(201).json(created);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
    return res.status(500).json({ error: 'Internal error' });
  }
};

export const getSearches = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const items = await rideService.listSearches(userId);
    res.json(items);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal error' });
  }
};
