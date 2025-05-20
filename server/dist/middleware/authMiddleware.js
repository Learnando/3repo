"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.verifyAdmin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// ✅ Middleware: Protect (requires valid token)
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = (await User_1.default.findById(decoded.id).select("-password"));
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.user = {
            _id: user._id.toString(),
            isAdmin: user.isAdmin,
        };
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.protect = protect;
// ✅ Middleware: Verify Admin
const verifyAdmin = async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    next();
};
exports.verifyAdmin = verifyAdmin;
// ✅ Optional: Middleware to only verify token structure
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
