import express from "express";
import {
  getPackageStats,
  generateResetLinkForUser,
} from "../controllers/adminController"; // ✅ Only import what's defined
import { adminOnly } from "../middleware/admin";
import { protect } from "../middleware/protect";

const router = express.Router();

// ✅ Requires auth and admin role
router.get("/package-stats", protect, adminOnly, getPackageStats);

// ✅ Generate reset password link
router.post("/generate-reset-link", generateResetLinkForUser);

export default router;
