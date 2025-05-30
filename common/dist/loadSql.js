"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSql = loadSql;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function loadSql(filename) {
    const fullPath = path_1.default.join(__dirname, '../sql', filename);
    return (0, fs_1.readFileSync)(fullPath, 'utf-8');
}
