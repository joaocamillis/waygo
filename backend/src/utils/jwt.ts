import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const signJwt = (payload: object, options?: jwt.SignOptions) => {
  return jwt.sign(payload, SECRET, options);
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, SECRET);
};
