import { Request, Response } from 'express';
import geoapifyService from '../services/geoapifyService';
import placeSuggestionService from '../services/placeSuggestionService';

export const autocomplete = async (req: Request, res: Response) => {
  try {
    const { input, lat, lng } = req.query;
    const userId = (req as any).userId;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Input is required' });
    }

    const suggestions = await placeSuggestionService.searchPlaces(
      userId,
      input,
      lat ? Number(lat) : undefined,
      lng ? Number(lng) : undefined
    );

    res.json({ suggestions });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal error' });
  }
};

export const reverse = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const result = await geoapifyService.reverseGeocode(Number(lat), Number(lng));
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal error' });
  }
};

export const route = async (req: Request, res: Response) => {
  try {
    const { originLat, originLng, destinationLat, destinationLng } = req.query;

    if (!originLat || !originLng || !destinationLat || !destinationLng) {
      return res.status(400).json({ error: 'All coordinates are required' });
    }

    const result = await geoapifyService.routing(
      Number(originLat),
      Number(originLng),
      Number(destinationLat),
      Number(destinationLng)
    );

    if (!result) {
      return res.status(400).json({ error: 'Could not calculate route' });
    }

    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal error' });
  }
};

export default { autocomplete, reverse, route };
