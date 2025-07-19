"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicAddress = exports.CLOUDFLARE_IP_RANGES = void 0;
const proxy_addr_1 = __importDefault(require("proxy-addr"));
exports.CLOUDFLARE_IP_RANGES = [
    "173.245.48.0/20",
    "103.21.244.0/22",
    "103.22.200.0/22",
    "103.31.4.0/22",
    "141.101.64.0/18",
    "108.162.192.0/18",
    "190.93.240.0/20",
    "188.114.96.0/20",
    "197.234.240.0/22",
    "198.41.128.0/17",
    "162.158.0.0/15",
    "104.16.0.0/13",
    "104.24.0.0/14",
    "172.64.0.0/13",
    "131.0.72.0/22",
    // IPv6
    "2400:cb00::/32",
    "2606:4700::/32",
    "2803:f800::/32",
    "2405:b500::/32",
    "2405:8100::/32",
    "2a06:98c0::/29",
    "2c0f:f248::/32",
];
const isTrustedProxy = proxy_addr_1.default.compile(exports.CLOUDFLARE_IP_RANGES);
const getPublicAddress = (req, res, next) => {
    try {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
            req.publicAddress = req.socket.remoteAddress || "127.0.0.1";
            return next();
        }
        const ip = (0, proxy_addr_1.default)(req, exports.CLOUDFLARE_IP_RANGES);
        const allIps = proxy_addr_1.default.all(req);
        const cameThroughCloudflare = allIps.some((addr) => isTrustedProxy(addr, 0));
        if (!cameThroughCloudflare) {
            console.warn(`Access blocked`);
            res.status(403).json({ error: "Access denied" });
            return;
        }
        req.publicAddress = ip;
        next();
    }
    catch (err) {
        console.warn("Could not resolve real IP:", err);
        res.status(403).json({ error: "Invalid IP or proxy chain" });
        return;
    }
};
exports.getPublicAddress = getPublicAddress;
