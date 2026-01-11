import { auth } from "@/auth";
import logger from "@/helper_functions/logger";
import orderModel from "@/models/order.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    dbConnection();
    const session = await auth();
    const orders = await orderModel
      .find({ userId: session?.user?.id })
      .populate("userId");

    if (!orders) {
      return NextResponse.json(
        {
          message: "unable to find anything",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Order Details",
        orders,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error("error occured while getting the order details :: ", err);
    return NextResponse.json(
      {
        message: "something went wrong",
      },
      { status: 500 }
    );
  }
}
