import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// ✅ Define the expected JWT payload structure
interface DecodedToken {
  id: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

// ✅ Extend Express.Request type to support `req.user`
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      _id: string;
      isAdmin: boolean;
    };
  }
}

// ✅ Middleware: Protect (requires valid token)
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    const user = (await User.findById(decoded.id).select("-password")) as {
      _id: string;
      isAdmin: boolean;
    };

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = {
      _id: user._id.toString(),
      isAdmin: user.isAdmin,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Middleware: Verify Admin
export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  next();
};

// ✅ Optional: Middleware to only verify token structure
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
