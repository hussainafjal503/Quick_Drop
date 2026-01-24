"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Scooter,
  Truck,
} from "lucide-react";
import { div } from "motion/react-client";
import Image from "next/image";
import { getSocket } from "@/utils/socket";

function OrderDetailCard({ order }: { order: any }) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const [status, setStatus] = useState(order?.status);

  useEffect((): any => {
    const socket = getSocket();

    socket?.on("order-status-update", (data) => {
      if (String(data?.orderId) == String(order?._id)) {
        setStatus(data?.status);
      }
    });

    return () => socket?.off("order-status-update");
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "out of delivery":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border border-b border-gray-100 px-5 py-4 bg-linear-to-r from-green-50 to-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 ">
            #Order{" "}
            <span className="text-orange-700 font-bold uppercase">
              {order?._id?.slice(0, 10)}
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Date : {new Date(order?.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${
              order?.isPaid
                ? "bg-green-100 text-green-700 border-green-300 "
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {order?.isPaid ? "Paid" : "Unpaid"}
          </span>

          <span
            className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4 ">
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          {order.paymentMethod == "cod" ? (
            <>
              <Scooter size={16} className="text-green-600" />
              <span>Cash on Delivery </span>
            </>
          ) : (
            <>
              <CreditCard size={16} className="text-green-600" />
              <span>Online Payment</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <MapPin size={16} className="text-orange-700" />
          <span className="truncate">
            {order?.address?.fullAddress || "Not Available"}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="w-full flex justify-between text-gray-700 hover:text-orange-700 items-center text-sm font-medium transition cursor-poiner"
          >
            <span className="flex items-center gap-2">
              <Package className="text-orange-700" size={16} />
              {expanded ? "Hide Items" : `View ${order?.items?.length} Items`}
            </span>

            {expanded ? (
              <ChevronUp size={16} className="text-orange-600" />
            ) : (
              <ChevronDown size={16} className="text-orange-600" />
            )}
          </button>

          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {order?.items?.length > 0 &&
                order?.items?.map((item: any, index: any) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 border rounded-lg object-cover border-gray-200"
                      />

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item?.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item?.qty} x {item?.unit}
                        </p>
                      </div>
                    </div>

                    {/* right */}
                    <div className="text-sm font-semibold text-orange-700">
                      ₹{Number(item?.price) * Number(item?.qty)}
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* total */}
        <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold ">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Truck size={16} className="text-orange-600" />
            <span className="">
              Delivery:{" "}
              <span
                className={`${
                  status == "pending"
                    ? "text-yellow-600"
                    : status == "delivered"
                    ? "text-green-700"
                    : "text-blue-600"
                } capitalize`}
              >
                {status}
              </span>
            </span>
          </div>

          <div>
            Total:{" "}
            <span className="text-orange-700 font-bold">
              ₹{order?.totalAmount}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default OrderDetailCard;
