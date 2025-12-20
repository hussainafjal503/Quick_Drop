import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
    },
    mobile: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "deliveryBoy", "admin"],
      required: true,
      default: "user",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel =
  mongoose?.models?.userModel || mongoose.model("userModel", userSchema);

export default userModel;
