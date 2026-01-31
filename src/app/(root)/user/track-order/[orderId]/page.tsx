"use client";
import LiveMap from "@/components/LiveMap";
import logger from "@/helper_functions/logger";
import { RootState } from "@/store/store";
import { getSocket } from "@/utils/socket";
import axios from "axios";
import ResultList from "leaflet-geosearch/dist/resultList.js";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function TrackOrder() {
  const { orderId } = useParams();
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const [order, setOrder] = useState<any>(null);
  const [userLocation, setUserLocation] = useState({
    lat: 0,
    long: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState({
    lat: 0,
    long: 0,
  });
  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await axios.get(`/api/user/get-order/${orderId}`);
        setOrder(response?.data?.order);
        console.log("Response", response?.data);
        setUserLocation({
          lat: response?.data?.order?.address?.latitude,
          long: response?.data?.order?.address?.longitude,
        });

        setDeliveryBoyLocation({
          lat: response?.data?.order?.assignedDeliveryBoy?.location
            ?.coordinates[1],
          long: response?.data?.order?.assignedDeliveryBoy?.location
            ?.coordinates[0],
        });
      } catch (err) {
        logger.error("error occured ", err);
      }
    };

    getOrder();
  }, [userData]);

  useEffect((): any => {
    const socket = getSocket();
    if (!socket) return;

    socket?.on("update-deliveryBoy-location", async ({ userId, lat, lon }) => {
      console.log(
        "lat and long mila",
        userId,
        order?.order?.assignedDeliveryBoy?._id,
      );

      if (userId == order?.assignedDeliveryBoy?._id) {
        console.log("condition or turu of false");
        setDeliveryBoyLocation({
          lat: lat,
          long: lon,
        });
      }
    });

    return () => socket.off("update-deliveryBoy-location");
  }, [order]);

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto pb-24">
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999">
          <button
            onClick={() => router.back()}
            className="p-2 bg-green-100 rounded-full"
          >
            <ArrowLeft className="text-green-700" size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold">Track Order</h2>

            <p className=" text-sm text-gray-600 uppercase">
              {order?._id?.toString()?.slice(0, 10)}
              <span className="text-green-700 ml-4 font-semibold">
                {order?.status}
              </span>
            </p>
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="rounded-3xl overflow-hidden border shadow">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;
