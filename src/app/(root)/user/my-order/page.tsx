"use client";

import OrderDetailCard from "@/components/user/OrderDetailCard";
import logger from "@/helper_functions/logger";
import axios from "axios";
import { ArrowLeft, Package } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
function page() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllOrderDetails = async () => {
    try {
      const result = await axios.get("/api/user/get-orders");
      //   logger.log(result?.data);
      setOrderDetails(result?.data?.orders);
    } catch (err) {
      logger.error("Error occured while getting the orders", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrderDetails();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center text-orange-700  min-h-[50]">
        Loading
      </div>
    );
  return (
    <div className="bg-linear-to-b from-white to gray-100 min-h-screen w-full">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative">
        <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50">
          <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
            <button
              onClick={() => router.replace("/")}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition"
            >
              <ArrowLeft className="text-orange-700" size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
          </div>
        </div>

        {orderDetails?.length === 0 ? (
          <div className="pt-20 flex flex-col items-center text-center">
            <Package className="text-orange-700 mb-4" size={70} />
            <h2 className="text-xl font-semibold text-orange-700">
              No Data Found{" "}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Start shopping to get your Order Details..
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {orderDetails.map((order, index) => (
              <motion.div
                key={index}
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
              >
                <OrderDetailCard order={order} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
