"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupportMessage = exports.getSupportMessages = exports.submitSupportMessage = void 0;
const SupportMessage_1 = __importDefault(require("../models/SupportMessage"));
const submitSupportMessage = async (req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        const newMessage = await SupportMessage_1.default.create({
            name,
            email,
            phone,
            message,
        });
        res.status(201).json(newMessage); // ✅ no need to return this
    }
    catch (err) {
        console.error("❌ Error saving support message:", err);
        res.status(500).json({ error: "Failed to save message" });
    }
};
exports.submitSupportMessage = submitSupportMessage;
const getSupportMessages = async (req, res) => {
    try {
        const messages = await SupportMessage_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    }
    catch (err) {
        console.error("❌ Failed to fetch messages:", err);
        res.status(500).json({ error: "Failed to load messages" });
    }
};
exports.getSupportMessages = getSupportMessages;
const deleteSupportMessage = async (req, res) => {
    try {
        await SupportMessage_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error("❌ Failed to delete message:", err);
        res.status(500).json({ error: "Failed to delete message" });
    }
};
exports.deleteSupportMessage = deleteSupportMessage;
