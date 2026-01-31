import { auth } from "@/auth";
import logger from "@/helper_functions/logger";
import deliveryAssignmentModel from "@/models/deliveryAssignment.model";
import orderModel from "@/models/order.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnection();

    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    const activeAssignement = await deliveryAssignmentModel
      .findOne({
        assignedTo: deliveryBoyId,
        status: "assigned",
      })
      .populate({
        path: "orderId",
        populate: { path: "address" },
      })
      .lean();

    if (!activeAssignement) {
      return NextResponse.json(
        {
          active: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        active: true,
        assignment: activeAssignement,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error("error occured while getting the curreent order");

    return NextResponse.json(
      {
        meesage: `internal serer error `,
      },
      { status: 500 }
    );
  }
}
