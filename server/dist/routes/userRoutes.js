"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authController_1 = require("../controllers/authController");
const authController_2 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/register", authController_1.register);
router.post("/login", authController_2.login);
router.post("/forgot-password", authController_2.forgotPassword);
router.post("/reset-password/:token", authController_2.resetPassword);
// ✅ Admin: Get all users
router.get("/", userController_1.getAllUsers);
// ✅ Get a single user profile by ID
router.get("/:id", userController_1.getUserProfile);
// ✅ Update a user profile by ID
router.put("/:id", userController_1.updateUserProfile);
// ✅ Admin: Delete a user by ID
router.delete("/:id", userController_1.deleteUser);
router.patch("/:id/update-account", authMiddleware_1.verifyToken, userController_1.updateUserAccount);
// In routes/userRoutes.ts
router.patch("/:id/promote", authMiddleware_1.verifyToken, userController_1.promoteUserToAdmin);
exports.default = router;
