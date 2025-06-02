"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeStringArray = sanitizeStringArray;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
function sanitizeStringArray(input) {
    const clean = (str) => {
        const trimmed = str.trim();
        return (0, sanitize_html_1.default)(trimmed, {
            allowedTags: [],
            allowedAttributes: {},
            allowedSchemes: [],
        });
    };
    try {
        if (typeof input === 'string') {
            clean(input);
            return true;
        }
        if (Array.isArray(input) && input.every(item => typeof item === 'string')) {
            input.forEach(item => clean(item));
            return true;
        }
        return false;
    }
    catch (error) {
        return false;
    }
}
