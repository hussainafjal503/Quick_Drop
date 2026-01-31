import { auth } from "@/auth";
import logger from "@/helper_functions/logger";
import deliveryAssignmentModel from "@/models/deliveryAssignment.model";
import orderModel from "@/models/order.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    await dbConnection();
    const { assignmentId } = await params;
    const session = await auth();
    const deliverBoyId = session?.user?.id;

    if (!deliverBoyId) {
      return NextResponse.json(
        {
          message: "UnAuhtorized Access",
        },
        { status: 400 }
      );
    }

    console.log("assingment ID", assignmentId);
    const assignement = await deliveryAssignmentModel.findById(assignmentId);

    if (!assignement) {
      return NextResponse.json(
        {
          message: "Assignment not found",
        },
        { status: 400 }
      );
    }

    if (assignement.status !== "brodcasted") {
      return NextResponse.json(
        {
          message: "Assignment expired",
        },
        { status: 400 }
      );
    }

    const alreadyAssigned = await deliveryAssignmentModel.findOne({
      assignedTo: deliverBoyId,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        {
          message: "You're already Assigned",
        },
        { status: 400 }
      );
    }

    assignement.assignedTo = deliverBoyId;
    assignement.status = "assigned";
    assignement.acceptedAt = new Date();

    await assignement.save();
    const order = await orderModel.findById(assignement.orderId);

    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        { status: 400 }
      );
    }

    order.assignedDeliveryBoy = deliverBoyId;
    await order.save();

    await deliveryAssignmentModel.updateMany(
      {
        _id: { $ne: assignement._id },
        broadCastTo: deliverBoyId,
        status: "brodcasted",
      },
      {
        $pull: { broadCastTo: deliverBoyId },
      }
    );

    return NextResponse.json(
      {
        message: "Order Accepted",
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error("Error occured while accepting the order", err);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
