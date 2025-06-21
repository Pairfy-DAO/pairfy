import jwt from "jsonwebtoken";

/**Verifies JWT token, without error handler*/
export function verifyToken(token: string, privateKey: string): any {
  try {
    const key = Buffer.from(privateKey, 'base64').toString('utf-8');

    return jwt.verify(token, key);
  } catch (err: any) {
    return null;
  }
}
