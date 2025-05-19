import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUserAccount,
  promoteUserToAdmin,
} from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";
import { register } from "../controllers/authController";
import {
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ✅ Admin: Get all users
router.get("/", getAllUsers);

// ✅ Get a single user profile by ID
router.get("/:id", getUserProfile);

// ✅ Update a user profile by ID
router.put("/:id", updateUserProfile);

// ✅ Admin: Delete a user by ID
router.delete("/:id", deleteUser);

router.patch("/:id/update-account", verifyToken, updateUserAccount);

// In routes/userRoutes.ts
router.patch("/:id/promote", verifyToken, promoteUserToAdmin);

export default router;
