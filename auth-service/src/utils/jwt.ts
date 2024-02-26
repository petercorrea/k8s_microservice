import jwt from 'jsonwebtoken'

export const signJWT = (payload: { user: string }): string | undefined => {
  if (process?.env?.JWT_SECRET != null) { return jwt.sign(payload, process?.env?.JWT_SECRET, { expiresIn: '1h' }) }
}
