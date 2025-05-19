"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController"); // ✅ Only import what's defined
const admin_1 = require("../middleware/admin");
const protect_1 = require("../middleware/protect");
const router = express_1.default.Router();
// ✅ Requires auth and admin role
router.get("/package-stats", protect_1.protect, admin_1.adminOnly, adminController_1.getPackageStats);
// ✅ Generate reset password link
router.post("/generate-reset-link", adminController_1.generateResetLinkForUser);
exports.default = router;
