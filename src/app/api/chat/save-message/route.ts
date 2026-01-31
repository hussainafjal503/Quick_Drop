import logger from "@/helper_functions/logger";
import messageModel from "@/models/message.model";
import orderModel from "@/models/order.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { send } from "process";

export async function POST(req: NextRequest) {
  try {
    await dbConnection();

    const { senderId, text, roomId, time } = await req.json();

    const room = await orderModel.findById(roomId);

    if (!room) {
      return NextResponse.json(
        {
          message: "Message room not found",
        },
        { status: 400 },
      );
    }

    console.log("roomID", roomId);

    const message = await messageModel.create({
      senderId,
      text,
      roomId: roomId,
      time,
    });

    return NextResponse.json({ message }, { status: 200 });
  } catch (err) {
    logger.error("Error occured while saving  the chat  ", err);

    return NextResponse.json(
      {
        message: "Something went wrong please try after some time",
      },
      { status: 500 },
    );
  }
}
