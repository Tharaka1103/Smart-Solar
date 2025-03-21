import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

// Secret key for JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

// Function to sign a JWT token
export async function signJwt(payload: any): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7 days
    .sign(JWT_SECRET)
  
  return token
}

// Function to verify a JWT token
export async function verifyJwt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    console.error('JWT verification error:', error)
    throw new Error('Invalid token')
  }
}

// Get JWT token from request cookies
export function getJwtFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get('auth-token')?.value
  return token || null
}
