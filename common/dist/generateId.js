"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationId = exports.getMediaGroupId = exports.getFileId = exports.getEventId = exports.getProductId = exports.productIdSchema = exports.productIdRegex = exports.getSellerId = void 0;
exports.createId = createId;
const nanoid_1 = require("nanoid");
const uuid_1 = require("uuid");
const zod_1 = require("zod");
function createId(alphabet, length) {
    if (!alphabet || typeof alphabet !== "string") {
        throw new Error("Invalid alphabet");
    }
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error("Length must be a positive integer");
    }
    return (0, nanoid_1.customAlphabet)(alphabet, length)();
}
const getSellerId = () => {
    return createId("0123456789ABCD", 21);
};
exports.getSellerId = getSellerId;
exports.productIdRegex = /^PRD-\d{6}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{7}$/;
exports.productIdSchema = zod_1.z.string().regex(exports.productIdRegex, {
    message: 'Invalid product ID format. Expected format: PRD-YYMMDD-XXXXXXX',
});
const getProductId = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const generate = (0, nanoid_1.customAlphabet)(alphabet, 7);
    const now = new Date();
    const date = now.toISOString().slice(2, 10).replace(/-/g, '');
    return `PRD-${date}-${generate()}`;
};
exports.getProductId = getProductId;
const getEventId = () => {
    return (0, uuid_1.v7)();
};
exports.getEventId = getEventId;
const getFileId = () => {
    return createId('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789', 16);
};
exports.getFileId = getFileId;
const getMediaGroupId = () => {
    const raw = createId('0123456789abcdef', 32);
    return [
        raw.slice(0, 8),
        raw.slice(8, 12),
        raw.slice(12, 16),
        raw.slice(16, 20),
        raw.slice(20),
    ].join('-');
};
exports.getMediaGroupId = getMediaGroupId;
const getNotificationId = () => {
    const generate = (0, nanoid_1.customAlphabet)("abcdefghijklmnopqrstuvwxyz0123456789", 16);
    return generate();
};
exports.getNotificationId = getNotificationId;
