export declare function createToken(params: object, expires?: string): string;
/**Verifies JWT token, without error handler*/
export declare function verifyToken(token: string, key: string): any;
export interface SellerEmailRegistrationToken {
    source: "service-seller";
    role: "SELLER";
    email: string;
    username: string;
}
