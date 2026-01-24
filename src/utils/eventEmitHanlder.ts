import logger from "@/helper_functions/logger";
import axios from "axios";
import React from "react";

async function eventEmitHanlder( event: string, data: any,socketId?: string,) {
  try {
    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`,
      {
        socketId,
        event,
        data,
      }
    );
  } catch (err) {
    logger.error("Error occured while event emitting");
  }

  return null;
}

export default eventEmitHanlder;
