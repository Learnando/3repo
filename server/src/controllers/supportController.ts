import { Request, Response } from "express";
import SupportMessage from "../models/SupportMessage";

export const submitSupportMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const newMessage = await SupportMessage.create({
      name,
      email,
      phone,
      message,
    });

    res.status(201).json(newMessage); // ✅ no need to return this
  } catch (err) {
    console.error("❌ Error saving support message:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
};

export const getSupportMessages = async (req: Request, res: Response) => {
  // this line is here temporarly console.log("📩 Admin is trying to fetch support messages:", req.user?.email);
  console.log("📩 Admin is trying to fetch support messages:", req.user?.email);

  try {
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Failed to fetch messages:", err);
    res.status(500).json({ error: "Failed to load messages" });
  }
};

export const deleteSupportMessage = async (req: Request, res: Response) => {
  try {
    await SupportMessage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Failed to delete message:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
};
