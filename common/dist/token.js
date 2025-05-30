"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createToken(params, expires) {
    const secretKey = process.env.AGENT_JWT_KEY;
    const defaultTime = process.env.TOKEN_EXPIRATION;
    const options = {
        expiresIn: expires || defaultTime,
    };
    return jsonwebtoken_1.default.sign(params, secretKey, options);
}
/**Verifies JWT token, without error handler*/
function verifyToken(token, key) {
    try {
        return jsonwebtoken_1.default.verify(token, key);
    }
    catch (err) {
        return null;
    }
}
