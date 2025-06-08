import jwt from "jsonwebtoken";
import ms from "ms";

export function createToken(
  params: object,
  privateKey: string,
  expires: string,
  issuer: string,
  audience: string[]
): string {

  const expiresIn: ms.StringValue = expires as ms.StringValue

  const options: jwt.SignOptions = {
    expiresIn,
    algorithm: "RS256",
    issuer,
    audience
  };

  const key = Buffer.from(privateKey, 'base64').toString('utf-8');

  return jwt.sign(params, key, options);
}
