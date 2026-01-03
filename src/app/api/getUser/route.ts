import { auth } from "@/auth";
import logger from "@/helper_functions/logger";
import userModel from "@/models/user.model";
import dbConnection from "@/utils/dbConnection";
import { NextResponse } from "next/server";

export async function GET(req: NextResponse) {
  try {
    await dbConnection();
    const session = await auth();
    // logger.log(session)
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "user not found",
        },
        {
          status: 400,
        }
      );
    }
    logger.log("getting userData::", session.user);
    const userData = await userModel
      .findOne({ email: session?.user?.email })
      .select("-password");
logger.log(userData)
    if (!userData) {
      return NextResponse.json(
        {
          message: "user not found",
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        message: "successfull",
        data: userData,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    logger.error("Error occured in getting user api::");
    return NextResponse.json(
      {
        message: "Unable to get server error",
      },
      {
        status: 500,
      }
    );
  }
}
