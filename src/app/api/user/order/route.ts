import logger from "@/helper_functions/logger";
import dbConnection from "@/utils/dbConnection";
import { NextResponse } from "next/server";

export default async function POST(req: NextResponse) {
  try {
    await dbConnection();

	
  } catch (Err) {
    logger.error("Error occured while order :: ", Err);
    return NextResponse.json(
      {
        message: "Internal server error::",
      },
      {
        status: 500,
      }
    );
  }
}
