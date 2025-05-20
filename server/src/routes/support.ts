import express from "express";
import {
  submitSupportMessage,
  getSupportMessages,
  deleteSupportMessage,
} from "../controllers/supportController";
import { protect, verifyAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", submitSupportMessage); // Public
router.get("/", protect, verifyAdmin, getSupportMessages); // Admin only
router.delete("/:id", protect, verifyAdmin, deleteSupportMessage); // Admin only

export default router;
