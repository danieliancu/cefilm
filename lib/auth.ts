import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export const signToken = (payload: AuthTokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
};

export const verifyToken = (token: string): AuthTokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch (err) {
    return null;
  }
};

export const getTokenFromRequest = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const cookieToken = req.cookies.get('cefilm_token')?.value;
  return cookieToken || null;
};
