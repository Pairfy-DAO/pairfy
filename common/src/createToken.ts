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
    issuer,
    audience
  };

  return jwt.sign(params, privateKey, options);
}
