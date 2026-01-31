import mongoose from "mongoose";

interface IMessage {
  _id?: mongoose.Schema.Types.ObjectId;
  roomId: mongoose.Schema.Types.ObjectId;
  text: string;
  senderId: mongoose.Schema.Types.ObjectId;
  time: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderModel",
    },
    text: {
      type: String,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },
    time: String,
  },
  { timestamps: true },
);

const messageModel =
  mongoose.models.messageModel || mongoose.model("messageModel", messageSchema);

export default messageModel;
