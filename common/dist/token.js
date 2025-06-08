"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**Verifies JWT token, without error handler*/
function verifyToken(token, privateKey) {
    try {
        const key = Buffer.from(privateKey, 'base64').toString('utf-8');
        return jsonwebtoken_1.default.verify(token, key);
    }
    catch (err) {
        return null;
    }
}
