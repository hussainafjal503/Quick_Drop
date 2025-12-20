import logger from "@/helper_functions/logger";
import userModel from "@/models/user.model";
import dbConnection from "@/utils/dbConnection";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnection();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "All fields are Required.",
        },
        { status: 400 }
      );
    }

    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return NextResponse.json(
        {
          message: "User already Exists.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      logger.log(password);
      return NextResponse.json(
        {
          message: "Password must be atleast 6 characters.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new Error("unable to register, Internal Server Error");
    }

    return NextResponse.json(
      {
        message: "Registr successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error("ERROR OCCURED IN REGISTER API :: ", err);

    return NextResponse.json(
      { message: `Register error  :: ${err}` },
      { status: 500 }
    );
  }
}
