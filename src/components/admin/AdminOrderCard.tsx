"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import logger from "@/helper_functions/logger";
import axios from "axios";

export default function AdminOrderCard({ order }: { order: any }) {
  const statusOptions = ["pending", "out of delivery"];
  const [expanded, setExpanded] = useState<boolean>(false);
  const [status, setStatus] = useState(order?.status);

  const handleUpdateStatus = async (orderId: string, value: string) => {
    if (!value) {
      alert(`You can't select ${value}`);
      return;
    }
    try {
      const res = await axios.post(
        `/api/admin/update-order-status/${orderId}`,
        {
          status: value,
        }
      );
      logger.log("respons mil gya status update kaa :: ", res?.data);
      setStatus(value);
    } catch (err) {
      logger.error("error occured while updating the stattus:: ", err);
    }finally{
      setStatus(value);

    }
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      key={order?._id}
      className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-lg font-bold flex items-center gap-2 text-green-700">
            <Package size={20} className="" />
            #Order:{" "}
            <span className="text-orange-700 uppercase">
              {order?._id?.slice(0, 10)}
            </span>
          </p>

          <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
              order?.isPaid
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {order?.isPaid ? "Paid" : "Unpaid"}
          </span>
          <p className="text-sm text-gray-600 mt-1 font-semibold">
            {new Date(order?.createdAt).toLocaleString()}
          </p>

          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <User size={16} className="text-green-600 " />
              <span>{order?.address?.fullName}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <Phone size={16} className="text-green-600 " />
              <span>{order?.address?.mobile}</span>
            </p>

            <p className="flex items-center gap-2 font-semibold">
              <MapPin size={16} className="text-green-600 " />
              <span>{order?.address?.fullAddress || "Not Available"}</span>
            </p>
          </div>
          {/* payment  */}
          <p className=" mt-3 text-gray-600 text-sm flex items-center gap-2 font-semibold">
            <CreditCard size={16} className="text-green-600 " />
            <span>
              {order?.paymentMethod == "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </span>
          </p>
        </div>

        {/* right */}

        <div className="flex flex-col items-start md:items-end gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              status == "delivered"
                ? "bg-green-100 text-green-100"
                : status == "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            } `}
          >
            {status}
          </span>

          <select
            onChange={(e) =>
              handleUpdateStatus(order._id?.toString(), e.target.value)
            }
            name=""
            id=""
            value={status}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="" className="uppercase">
              {"Choose status".toUpperCase()}
            </option>

            {statusOptions?.map((st) => (
              <option key={st} value={st}>
                {st.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-3 pt-3">
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
                      src={item?.image || ""}
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

      <div className="border-t mt-4  pt-3 flex justify-between items-center text-sm font-semibold ">
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
    </motion.div>
  );
}
