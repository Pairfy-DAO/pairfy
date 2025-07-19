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
        issuer,
        audience
    };
    return jsonwebtoken_1.default.sign(params, privateKey, options);
}
