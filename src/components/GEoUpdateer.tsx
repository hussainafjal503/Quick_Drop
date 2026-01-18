"use client";

import React, { useEffect } from "react";
import { getSocket } from "../utils/socket";
import logger from "@/helper_functions/logger";

function GEoUpdateer({ userId }: { userId: string }) {
  const socket = getSocket();
  socket?.emit("identity", userId);

  useEffect(() => {
    if (!userId) return;
    if (!navigator.geolocation) return;

    // console.log("hi use effect run kar rha hai sahi sahi");

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        socket?.emit("updateLocation", { userId, lat, lon });
      },
      (err) => {
        logger.log("Error while watching ");
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [userId, socket]);

  return null;
}

export default GEoUpdateer;
