import logger from "@/helper_functions/logger";
import orderModel from "@/models/order.model";
import userModel from "@/models/user.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/cancel-order`,

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Quick-drop_payment",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],

      metadata: {
        orderId: newOrder?._id.toString(),
      },
    });

    return NextResponse.json(
      {
        url: session?.url,
      },
      {
        status: 200,
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
