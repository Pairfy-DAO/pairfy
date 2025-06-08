"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createToken(params, privateKey, expires, issuer, audience) {
    const expiresIn = expires;
    const options = {
        expiresIn,
        algorithm: "RS256",
        issuer,
        audience
    };
    const key = Buffer.from(privateKey, 'base64').toString('utf-8');
    return jsonwebtoken_1.default.sign(params, key, options);
}
