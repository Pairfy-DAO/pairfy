"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const util_1 = require("util");
const crypto_1 = require("crypto");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
class Password {
    static async toHash(password) {
        const salt = (0, crypto_1.randomBytes)(8).toString("hex");
        const buf = (await scryptAsync(password, salt, 64));
        return `${buf.toString("hex")}.${salt}`;
    }
    static async compare(storedPassword, suppliedPassword) {
        const [hashedPassword, salt] = storedPassword.split(".");
        const buf = (await scryptAsync(suppliedPassword, salt, 64));
        return buf.toString("hex") === hashedPassword;
    }
}
exports.Password = Password;
async function hashPassword(password) {
    return Password.toHash(password);
}
async function comparePassword(a, b) {
    return Password.compare(a, b);
}
