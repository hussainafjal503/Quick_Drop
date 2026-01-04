import mongoose from "mongoose";

interface IOrder {
  _id?: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  items: [
    {
      groceryId: mongoose.Schema.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      qty: number;
    }
  ];
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    city: string;
    state: string;
    pincode: string;
    mobile: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    items: [
      {
        groceryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "groceryModel",
          required: true,
        },
        price: String,
        name: String,
        unit: String,
        image: String,
        qty: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    address: {
      fullName: String,
      city: String,
      state: String,
      pincode: String,
      mobile: String,
      fullAddress: String,
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ["pending", "out of delivery", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.orderModel || mongoose.model("orderModel", orderSchema);

export default orderModel;
