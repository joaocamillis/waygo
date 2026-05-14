import pool from '../database/connection';
import { randomUUID } from 'crypto';
import { hashPassword, comparePassword } from '../utils/password';
import { signJwt } from '../utils/jwt';

export const register = async (name: string, email: string, password: string) => {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount && existing.rowCount > 0) throw { status: 400, message: 'Email already in use' };
  const id = randomUUID();
  const password_hash = await hashPassword(password);
  const { rows } = await pool.query(
    'INSERT INTO users (id, name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING id, name, email, created_at',
    [id, name, email, password_hash]
  );
  const user = rows[0];
  const token = signJwt({ userId: user.id });
  return { user, token };
};

export const login = async (email: string, password: string) => {
  const { rows } = await pool.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };
  const token = signJwt({ userId: user.id });
  return { user: { id: user.id, name: user.name, email: user.email }, token };
};

export const getUserById = async (id: string) => {
  const { rows } = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
  return rows[0] || null;
};
