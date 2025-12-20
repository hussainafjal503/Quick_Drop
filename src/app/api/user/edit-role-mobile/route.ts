import { auth } from "@/auth";
import logger from "@/helper_functions/logger";
import userModel from "@/models/user.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnection();

    const { role, mobile } = await req.json();

    const session = await auth();

    const userData = await userModel.findOneAndUpdate(
      { email: session?.user?.email },
      {
        role,
        mobile,
      },
      { new: true }
    );

    if (!userData) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Updated",
        userData,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error("ERRor occured in edit role api :: ", err);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
