import logger from "@/helper_functions/logger";
import messageModel from "@/models/message.model";
import { getSocket } from "@/utils/socket";
import axios from "axios";
import { Send } from "lucide-react";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";

type props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};

function DeliveryChat({ orderId, deliveryBoyId }: props) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("join-room", orderId);
  }, []);

  const sendMessage = () => {
    const socket = getSocket();
    if (!socket) return;

    const message = {
      roomId: orderId,
      text: newMessage,
      senderId: deliveryBoyId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);
    setNewMessage("");
  };

  useEffect(() => {
    getAllMessages();
  }, []);
  const getAllMessages = async () => {
    try {
      const response = await axios.post("/api/chat/get-all-messages", {
        roomId: orderId,
      });

      logger.log("result of all messages", response?.data);
    } catch (err) {
      logger.error("error occured while getting all messages", err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col">
      <div className="flex gap-2 mt-3 border-t pt-3">
        <input
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          type="text"
          placeholder="Type a Message.."
          className=" flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={sendMessage}
          className=" bg-orange-600 hover:bg-orange-700 p-3 rounded-xl text-white"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default DeliveryChat;
