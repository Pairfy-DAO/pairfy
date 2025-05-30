"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ApiError = void 0;
const zod_1 = require("zod");
const index_1 = require("./index");
class ApiError extends Error {
    constructor(statusCode, message, options) {
        super(message);
        this.name = new.target.name;
        this.statusCode = statusCode;
        this.code = options?.code || index_1.ERROR_CODES.INTERNAL_ERROR;
        this.isOperational = options?.isOperational ?? true;
        if (options?.code === index_1.ERROR_CODES.VALIDATION_ERROR) {
            this.details = options.details;
        }
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, new.target);
        }
    }
}
exports.ApiError = ApiError;
const normalizeError = (err) => {
    if (err instanceof ApiError)
        return err;
    if (err instanceof zod_1.ZodError) {
        return new ApiError(400, "Validation error", {
            code: index_1.ERROR_CODES.VALIDATION_ERROR,
            details: err.flatten(),
            isOperational: true,
        });
    }
    if (err instanceof Error) {
        return new ApiError(500, "Internal server error", {
            code: index_1.ERROR_CODES.INTERNAL_ERROR,
            isOperational: false,
        });
    }
    return new ApiError(500, "Unknown internal error", {
        code: index_1.ERROR_CODES.INTERNAL_ERROR,
        isOperational: false,
    });
};
const errorHandler = (err, _req, res, _next) => {
    index_1.logger.error(err);
    const normalized = normalizeError(err);
    res.setHeader("Content-Type", "application/json");
    const errorResponse = {
        status: normalized.statusCode,
        message: normalized.isOperational
            ? normalized.message
            : "Internal server error",
        code: normalized.code,
        details: normalized.code === index_1.ERROR_CODES.VALIDATION_ERROR
            ? normalized.details
            : null,
    };
    index_1.logger.error(errorResponse);
    res.status(normalized.statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
