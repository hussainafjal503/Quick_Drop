"use client";
import logger from "@/helper_functions/logger";
import { getSocket } from "@/utils/socket";
import axios from "axios";
import { div } from "motion/react-client";
import React, { useEffect, useState } from "react";
import { json } from "stream/consumers";
import LiveMap from "../LiveMap";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useGetUser from "@/hooks/useGetUser";
import DeliveryChat from "../chat/DeliveryChat";

function DeliveryBoy() {
  const { userData } = useSelector((state: RootState) => state.user);
  useGetUser();

  const [assignementData, setAssignmentData] = useState<any>([]);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<any>({ lat: 0, long: 0 });
  const [deliverBoyLocation, setDeliveryBoyLocation] = useState<any>({
    lat: 0,
    long: 0,
  });

  useEffect((): any => {
    const socket = getSocket();
    socket?.on("notify-delivery", (deliveryAssignment) => {
      console.log("assignemnt DAta :: ", deliveryAssignment);

      setAssignmentData((prev: any) => [...prev, deliveryAssignment]);
    });

    return () => socket?.off("notify-delivery");
  }, []);

  const fetchAssignment = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignements");
      //   console.log("result :: ", result?.data?.assignement);
      setAssignmentData(result?.data?.assignement);
    } catch (err) {}
  };
  useEffect(() => {
    fetchAssignment();
    fetchCurrentOrder();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const response = await axios.get(
        `/api/delivery/accept-assignement/${id}`,
      );
      // console.log("Rsult ::accept", response);
    } catch (err) {
      logger.error("Error occrred while");
    }
  };

  const fetchCurrentOrder = async () => {
    try {
      const response = await axios.get("/api/delivery/current-order");

      // logger.log("response :: ", response);
      if (response?.data?.active) {
        setActiveOrder(response?.data?.assignment);
        setUserLocation({
          lat: response?.data?.assignment?.orderId?.address?.latitude,
          long: response?.data?.assignment?.orderId?.address?.longitude,
        });
      }
    } catch (err) {
      logger.error("error occured while fetching the current order :: ", err);
    }
  };

  useEffect(() => {
    if (!userData) return;
    const socket = getSocket();
    // console.log("hi use effect run kar rha hai sahi sahi");
    console.log("userDAta,", userData);

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        console.log("Delivery boy location::", lat, lon);
        setDeliveryBoyLocation({
          lat: lat,
          long: lon,
        });
        socket?.emit("updateLocation", {
          userId: userData?._id,
          lat,
          lon,
        });
      },
      (err) => {
        logger.log("Error while watching ");
      },
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData]);

  if (activeOrder && userLocation) {
    return (
      <div className="p-4 min-h-screen bg-gray-50 pt-25">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-orange-700">
            Active Delivery
          </h1>
          <p className="uppercase text-gray text-sm mb-4 mt-1">
            Order #{activeOrder?.orderId?._id.slice(0, 10)}
          </p>

          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliverBoyLocation}
            />
          </div>

          <DeliveryChat
            orderId={activeOrder?.orderId?._id}
            deliveryBoyId={userData?._id!}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-4 ">Delivery Assignments</h2>
        {/* {console.log(JSON.stringify(assignementData))} */}
        {assignementData &&
          assignementData?.map((a: any, index: any) => (
            <div
              key={index}
              className="p-5 bg-white rounded-xl shadow mb-4 border"
            >
              <p>
                <strong>Order Id # </strong> {a?.orderId?._id?.slice(0, 10)}
              </p>
              <p className="text-gray-500">
                <strong>Address </strong>
                {a?.orderId?.address?.fullAddress}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleAccept(a?._id)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg cursor-pointer"
                >
                  Accept
                </button>
                <button className="flex-1 bg-red-600 text-white cursor-pointer py-3 rounded-lg">
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default DeliveryBoy;
