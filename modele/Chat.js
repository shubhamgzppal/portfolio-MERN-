import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userMessage: String,
  botReply: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
