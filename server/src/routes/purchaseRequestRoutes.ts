import express, { Request, Response, NextFunction } from "express";
import upload from "../middleware/upload";
import {
  createPurchaseRequest,
  getAllPurchaseRequests,
  updatePurchaseStatus,
  deletePurchaseRequest,
  setPurchaseFinalFee,
  markPurchaseAsPaid,
  userSoftDeletePurchaseRequest,
  uploadPurchaseReceipt, // ✅ Include here
} from "../controllers/purchaseRequestController";
import PurchaseRequest from "../models/PurchaseRequest";
import { cancelPurchaseRequest } from "../controllers/purchaseRequestController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// 📥 Submit new request (user)
router.post("/", upload.single("screenshot"), createPurchaseRequest);

// 📄 Get all requests (admin)
router.get("/", getAllPurchaseRequests);

// 📥 Get requests by user ID
// 📥 Get requests by user ID
router.get(
  "/user/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;

      const requests = await PurchaseRequest.find({
        userId,
        deletedByUser: { $ne: true }, // ✅ EXCLUDE soft-deleted requests
      }).sort({ createdAt: -1 });

      res.status(200).json(requests);
    } catch (err) {
      next(err);
    }
  }
);

// 🔄 Update status, fee, receipt, and mark as paid
router.patch("/:id/status", updatePurchaseStatus);
router.patch("/:id/fee", setPurchaseFinalFee);
router.patch("/:id/paid", markPurchaseAsPaid);
router.patch("/:id/cancel", cancelPurchaseRequest);

router.patch(
  "/:id/upload-receipt",
  upload.single("receipt"),
  uploadPurchaseReceipt
);
router.patch("/:id/soft-delete", protect, userSoftDeletePurchaseRequest);
router.patch("/:id", deletePurchaseRequest);

export default router;
