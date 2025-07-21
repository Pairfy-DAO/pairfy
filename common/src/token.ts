import jwt from "jsonwebtoken";

/**Verifies JWT token, without error handler*/
export function verifyToken(token: string, privateKey: string): any {
  try {
    return jwt.verify(token, privateKey);
  } catch (err: any) {
    return null;
  }
}
