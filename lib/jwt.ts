import jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'

// Custom interface for our JWT payload
export interface CustomJwtPayload extends JwtPayload {
  userId: string
  email: string
  role: string
}

// Generate a JWT token
export function generateToken(payload: Omit<CustomJwtPayload, 'iat' | 'exp'>): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  })
}

// Verify a JWT token
export function verifyToken(token: string): CustomJwtPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as CustomJwtPayload
    return decoded
  } catch (error) {
    throw new Error('Invalid token')
  }
}
