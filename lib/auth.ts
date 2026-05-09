import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(encodedSecret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch (error) {
    return null;
  }
}
