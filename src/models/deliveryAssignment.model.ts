import mongoose from "mongoose";

interface IDeliveryAssignment {
  _id?: mongoose.Schema.Types.ObjectId;
  orderId: mongoose.Schema.Types.ObjectId;
  broadCastTo: mongoose.Schema.Types.ObjectId[];
  assignedTo: mongoose.Schema.Types.ObjectId | null;
  status: "brodcasted" | "assigned" | "completed";
  acceptedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const deliveryAssignementSchema = new mongoose.Schema<IDeliveryAssignment>(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderModel",
    },

    broadCastTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },

    status: {
      type: String,
      enum: ["brodcasted", "assigned", "completed"],
      default: "brodcasted",
    },
    acceptedAt: {
      types: Date,
    },
  },
  { timestamps: true }
);

const deliveryAssignmentModel =
  mongoose.models.deliveryAssignmentModel ||
  mongoose.model("deliveryAssignmentModel", deliveryAssignementSchema);

export default deliveryAssignmentModel;
