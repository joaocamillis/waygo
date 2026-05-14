import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

const useSSL =
  process.env.DATABASE_SSL === 'true' || connectionString.includes('sslmode=require') || process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined,
});

export default pool;
