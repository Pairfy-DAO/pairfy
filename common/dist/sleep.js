"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = sleep;
function sleep(timeInMs) {
    timeInMs =
        typeof timeInMs === "string" ? (timeInMs = parseInt(timeInMs)) : timeInMs;
    return new Promise((resolve) => setTimeout(() => resolve(false), timeInMs));
}
