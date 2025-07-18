"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerRequired = exports.sellerMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("./index");
const sellerMiddleware = (req, res, next) => {
    if (!req.session?.jwt) {
        return next();
    }
    try {
        const privateKey = Buffer.from(process.env.AGENT_JWT_KEY, 'base64').toString('utf-8');
        const sessionData = jsonwebtoken_1.default.verify(req.session.jwt, privateKey);
        if (sessionData.role === "SELLER") {
            req.sellerData = sessionData;
        }
    }
    catch (err) {
        index_1.logger.error(err);
    }
    return next();
};
exports.sellerMiddleware = sellerMiddleware;
const sellerRequired = (req, _res, next) => {
    if (!req.sellerData) {
        return next(new index_1.ApiError(401, "Unauthorized seller", {
            code: index_1.ERROR_CODES.UNAUTHORIZED,
        }));
    }
    next();
};
exports.sellerRequired = sellerRequired;
