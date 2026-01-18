import userModel from "@/models/user.model";
import dbConnection from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    dbConnection();

    const adminUser = await userModel.find({
      role: "admin",
    });

    if (adminUser.length > 0) {
      return NextResponse.json(
        {
          adminExists: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        adminExists: false,
      },
      { status: 200 }
    );
  } catch (err) {}
}
