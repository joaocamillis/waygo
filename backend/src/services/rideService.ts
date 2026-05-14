import pool from '../database/connection';
import { randomUUID } from 'crypto';

export const createSearch = async (userId: string, data: any) => {
  const id = randomUUID();
  const { rows } = await pool.query(
    `INSERT INTO ride_searches
      (id, user_id, origin_lat, origin_lng, origin_address, destination_lat, destination_lng, destination_address, distance_km, duration_min, selected_provider)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
    [
      id,
      userId,
      data.originLat,
      data.originLng,
      data.originAddress || null,
      data.destinationLat,
      data.destinationLng,
      data.destinationAddress || null,
      data.distanceKm ?? null,
      data.durationMin ?? null,
      data.selectedProvider ?? null,
    ]
  );
  return rows[0];
};

export const listSearches = async (userId: string) => {
  const { rows } = await pool.query('SELECT * FROM ride_searches WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return rows;
};
