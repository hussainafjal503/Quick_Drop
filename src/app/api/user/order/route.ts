import logger from "@/helper_functions/logger";
import orderModel from "@/models/order.model";
import userModel from "@/models/user.model";
import dbConnection from "@/utils/dbConnection";
import eventEmitHanlder from "@/utils/eventEmitHanlder";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnection();

    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();

    if (!userId || !items || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        {
          message: "All fields are Required..",
        },
        {
          status: 400,
        }
      );
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return NextResponse.json(
        {
          message: "user not found..",
        },
        {
          status: 400,
        }
      );
    }

    const newOrder = await orderModel.create({
      userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    await eventEmitHanlder("new-order",newOrder)
    if (!newOrder) {
      return NextResponse.json(
        {
          message: "Something went wrong",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "successfully order created",
        newOrder,
      },
      {
        status: 201,
      }
    );
  } catch (Err) {
    logger.error("Error occured while order :: ", Err);
    return NextResponse.json(
      {
        message: "Internal server error::",
      },
      {
        status: 500,
      }
    );
  }
}
