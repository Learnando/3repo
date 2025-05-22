import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "haiti-package-receipts", // ✅ now inside a function
    allowed_formats: ["jpeg", "jpg", "png", "gif"],
    transformation: [{ width: 800, crop: "limit" }],
  }),
});

const upload = multer({ storage });

export default upload;
