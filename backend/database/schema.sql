CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar NOT NULL,
  email varchar UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ride_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  origin_lat numeric,
  origin_lng numeric,
  origin_address text,
  destination_lat numeric,
  destination_lng numeric,
  destination_address text,
  distance_km numeric,
  duration_min numeric,
  selected_provider varchar,
  created_at timestamp with time zone DEFAULT now()
);
