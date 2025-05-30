import { GraphQLError } from "graphql";
export declare class ApiGraphQLError extends GraphQLError {
    statusCode: number;
    code: string;
    constructor(statusCode: number, message: string, options?: {
        code?: string;
        details?: unknown;
        path?: readonly (string | number)[];
    });
}
export declare const normalizeGraphError: (err: unknown) => ApiGraphQLError;
export declare const throwGraphQLError: (statusCode: number, message: string, options?: {
    code?: string;
    statusCode?: number;
    details?: unknown;
}) => never;
