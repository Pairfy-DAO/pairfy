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
        return jsonwebtoken_1.default.verify(token, privateKey);
    }
    catch (err) {
        return null;
    }
}
