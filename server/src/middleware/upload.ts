import multer from "multer";
import path from "path";
import fs from "fs";

// Define the uploads directory path
const uploadsDir = path.join(__dirname, "uploads");

// Configure storage with dynamic directory creation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      // Create the directory if it doesn't exist
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Set up Multer with storage configuration and file filter
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    // Define allowed file types
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export default upload;
