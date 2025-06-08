import jwt from "jsonwebtoken";
import ms from "ms";

export function createToken(
  params: object,
  privateKey: string,
  expires: ms.StringValue | number,
  issuer: string,
  audience: string
): string {
  const options: jwt.SignOptions = {
    expiresIn: expires,
    algorithm: "RS256",
    issuer,
    audience
  };

  return jwt.sign(params, privateKey, options);
}
