"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSignatureCIP30 = isValidSignatureCIP30;
const cardano_verify_datasignature_1 = __importDefault(require("@cardano-foundation/cardano-verify-datasignature"));
function isValidSignatureCIP30(signature, key, message, address32) {
    try {
        return (0, cardano_verify_datasignature_1.default)(signature, key, message, address32);
    }
    catch (err) {
        return false;
    }
}
