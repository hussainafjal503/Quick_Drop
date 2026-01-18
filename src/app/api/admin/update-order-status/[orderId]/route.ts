import logger from "@/helper_functions/logger";
import deliveryAssignmentModel from "@/models/deliveryAssignment.model";
import orderModel from "@/models/order.model";
import userModel from "@/models/user.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    dbConnection();
    const { orderId } = await params;
    const { status } = await req.json();
    console.log("status", status);
    const order = await orderModel.findById(orderId).populate("userId");

    if (!order) {
      return NextResponse.json(
        {
          message: "Resource not found || order not found",
        },
        { status: 400 }
      );
    }

    order.status = status;
    let availableDeliveryBoysPayload: any = [];

    if (status === "out of delivery" && !order.assignement) {
      const { latitude, longitude } = order.address;
      const nearByDeliveryBoys = await userModel.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys?.map((b) => b._id);

      const busyIds = await deliveryAssignmentModel
        .find({
          assignedTo: { $in: nearByIds },
          status: { $nin: ["brodcasted", "completed"] },
        })
        .distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((b) => String(b)));

      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id))
      );

      const candidates = availableDeliveryBoys?.map((b) => b._id);
      console.log("candidates", candidates);
      if (candidates.length == 0) {
        await order.save();
        return NextResponse.json(
          {
            message:
              "Delivery Executives are busy right now. please check back later! ",
          },
          { status: 400 }
        );
      }

      const deliveryAssignment = await deliveryAssignmentModel.create({
        orderId,
        broadCastTo: candidates,
        status: "brodcasted",
      });

      order.assignement = deliveryAssignment._id;
      availableDeliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        name: b.name,
        id: b._id,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));

      // await deliveryAssignment.populate("orderModel")
    }

    await order.save();
    // await order.populate("userModel")

    return NextResponse.json(
      {
        assignment: order.assignement?._id,
        availableBoys: availableDeliveryBoysPayload,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error("Error occured while updateing the order stataus::", err);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
