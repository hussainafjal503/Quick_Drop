import logger from "@/helper_functions/logger";
import userModel from "@/models/user.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnection();

    const { userId, socketId } = await req.json();
    // console.log("user id hai ki nhi:: ", userId);

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        socketId,
        isOnline: true,
      },
      { new: true }
    );

    // console.log("check that the api is called or not", user);
    if (!user) {
      return NextResponse.json(
        { message: "resource not found" },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      { message: "Success" },
      {
        status: 200,
      }
    );
  } catch (err) {
    logger.error("Error occured while connecting the socket");

    return NextResponse.json(
      { message: "Internal server error." },
      {
        status: 500,
      }
    );
  }
}
