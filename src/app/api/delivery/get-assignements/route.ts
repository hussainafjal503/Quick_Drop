import { auth } from "@/auth";
import logger from "@/helper_functions/logger";
import deliveryAssignmentModel from "@/models/deliveryAssignment.model";
import dbConnection from "@/utils/dbConnection";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnection();
    const session = await auth();
    const assignement = await deliveryAssignmentModel
      .find({
        broadCastTo: session?.user?.id,
        status: "brodcasted",
      })
      .populate("orderId");

    if (!assignement) {
      return NextResponse.json(
        {
          message: "not found",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        assignement,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error("Errro occure dwhile getting the delivery assignemnt:", err);

    return NextResponse.json(
      {
        message: "Internal Server Error.",
      },
      { status: 500 }
    );
  }
}
