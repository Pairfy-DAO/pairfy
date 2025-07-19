"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRequiredMiddleware = exports.userMiddleware = void 0;
const index_1 = require("./index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => {
    if (!req.session?.jwt) {
        return next();
    }
    try {
        const privateKey = process.env.AGENT_JWT_KEY;
        const sessionData = jsonwebtoken_1.default.verify(req.session.jwt, privateKey);
        if (sessionData.role === "USER") {
            req.userData = sessionData;
        }
    }
    catch (err) {
        index_1.logger.error(err);
    }
    return next();
};
exports.userMiddleware = userMiddleware;
const userRequiredMiddleware = (req, _res, next) => {
    if (!req.userData) {
        return next(new index_1.ApiError(401, "Unauthorized", {
            code: index_1.ERROR_CODES.UNAUTHORIZED,
        }));
    }
    next();
};
exports.userRequiredMiddleware = userRequiredMiddleware;
