"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwGraphQLError = exports.normalizeGraphError = exports.ApiGraphQLError = void 0;
const graphql_1 = require("graphql");
const zod_1 = require("zod");
const index_1 = require("./index");
class ApiGraphQLError extends graphql_1.GraphQLError {
    constructor(statusCode, message, options = {}) {
        const code = options.code ?? index_1.ERROR_CODES.INTERNAL_ERROR;
        super(message, {
            extensions: {
                code,
                status: statusCode || 500,
                ...(code === index_1.ERROR_CODES.VALIDATION_ERROR && options.details
                    ? { details: options.details }
                    : {}),
            },
            path: options.path,
        });
        this.code = code;
        this.statusCode = statusCode || 500;
    }
}
exports.ApiGraphQLError = ApiGraphQLError;
const normalizeGraphError = (err) => {
    if (err instanceof ApiGraphQLError)
        return err;
    if (err instanceof zod_1.ZodError) {
        return new ApiGraphQLError(400, "Validation error", {
            code: index_1.ERROR_CODES.VALIDATION_ERROR,
            details: err.flatten(),
        });
    }
    if (err instanceof graphql_1.GraphQLError) {
        return new ApiGraphQLError(err.extensions.status || 500, err.message, {
            code: err.extensions.code || index_1.ERROR_CODES.INTERNAL_ERROR,
            path: err.path,
        });
    }
    if (err instanceof Error) {
        return new ApiGraphQLError(500, "Internal server error", {
            code: index_1.ERROR_CODES.INTERNAL_ERROR
        });
    }
    return new ApiGraphQLError(500, "Unknown internal error", {
        code: index_1.ERROR_CODES.INTERNAL_ERROR
    });
};
exports.normalizeGraphError = normalizeGraphError;
const throwGraphQLError = (statusCode, message, options) => {
    throw new ApiGraphQLError(statusCode, message, options);
};
exports.throwGraphQLError = throwGraphQLError;
