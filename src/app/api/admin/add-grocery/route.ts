import { auth } from "@/auth";
import logger from "@/helper_functions/logger";
import groceryModel from "@/models/grocery.model";
import uploadonCloudinary from "@/utils/cloudinary";
import dbConnection from "@/utils/dbConnection";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {
  try {
    await dbConnection();

    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          message: "Unauthorized Access",
        },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const category = formData.get("category");
    const unit = formData.get("unit");
    const price = formData.get("price");
    const file = formData.get("image") as Blob | null;
    let imageUrl;
    if (file) {
      imageUrl = uploadonCloudinary(file);
    }

    const grocery = await groceryModel.create({
      name,
      price,
      category,
      unit,
      image: imageUrl,
    });

    return NextResponse.json(
      {
        message: "grocery Added ",
        data: grocery,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error("Error occured while add groery :: ", err);
    return NextResponse.json(
      {
        message: "Unable to add Grocery,Internal server Error",
      },
      { status: 500 }
    );
  }
}
