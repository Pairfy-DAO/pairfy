import jwt from "jsonwebtoken";

/**Verifies JWT token, without error handler*/
export function verifyToken(token: string, key: string): any {
  try {
    return jwt.verify(token, key);
  } catch (err: any) {
    return null;
  }
}

export interface SellerEmailRegistrationToken {
  source: "service-seller";
  role: "SELLER";
  email: string;
  username: string;
}
