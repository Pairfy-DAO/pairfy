/**Verifies JWT token, without error handler*/
export declare function verifyToken(token: string, privateKey: string): any;
export interface SellerEmailRegistrationToken {
    source: "service-seller";
    role: "SELLER";
    email: string;
    username: string;
}
