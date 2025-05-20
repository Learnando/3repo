"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supportController_1 = require("../controllers/supportController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", supportController_1.submitSupportMessage); // Public
router.get("/", authMiddleware_1.protect, authMiddleware_1.verifyAdmin, supportController_1.getSupportMessages); // Admin only
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.verifyAdmin, supportController_1.deleteSupportMessage); // Admin only
exports.default = router;
