export declare class Password {
    static toHash(password: string): Promise<string>;
    static compare(storedPassword: string, suppliedPassword: string): Promise<boolean>;
}
export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(a: string, b: string): Promise<boolean>;
