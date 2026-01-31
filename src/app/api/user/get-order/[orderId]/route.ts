import logger from "@/helper_functions/logger";
import orderModel from "@/models/order.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    await dbConnection();
    const { orderId } = await params;
    // console.log("server order, ", params);
    const order = await orderModel
      .findById(orderId)
      .populate("assignedDeliveryBoy");

    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        order,
      },
      { status: 200 },
    );
  } catch (Err) {
    logger.error("Error occured while getting singel order", Err);

    return NextResponse.json(
      {
        message: "Something went wrong, please try after some times..",
      },
      { status: 500 },
    );
  }
}
