import logger from "@/helper_functions/logger";
import userModel from "@/models/user.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnection();
    const { userId, location } = await req.json();

    if (!userId || !location) {
      return NextResponse.json(
        {
          message: "Resources required ",
        },
        { status: 400 }
      );
    }

    // console.log("before update:", userId, location);
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        location,
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found ",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Updated  ",
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error(
      "error occured while updating the loation throught the socket io",
      err
    );

    return NextResponse.json(
      {
        message: "Internal Server Error ",
      },
      { status: 500 }
    );
  }
}
