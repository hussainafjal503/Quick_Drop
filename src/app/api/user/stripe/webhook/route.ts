import logger from "@/helper_functions/logger";
import orderModel from "@/models/order.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get("stripe-signature");
    const rawbody = await req.text();
    let event;

    event = stripe.webhooks.constructEvent(
      rawbody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event?.type === "checkout.session.completed") {
      const session = event.data.object;
      await dbConnection();

      await orderModel.findByIdAndUpdate(session?.metadata?.orderId, {
        isPaid: true,
      });
    }

    console.log(event);

    return NextResponse.json(
      {
        message: "PaymentSuccessfull",
      },
      { status: 200 }
    );
  } catch (Err) {
    logger.error("Error occured in webhook ::");
    return NextResponse.json(
      {
        message: "Something went wrong..",
      },
      {
        status: 500,
      }
    );
  }
}
