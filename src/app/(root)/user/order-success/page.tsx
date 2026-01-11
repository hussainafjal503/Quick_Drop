"use client";

import React from "react";
import { motion } from "motion/react";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";
function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center bg-linear-to-b from-orange-50 to-white  ">
      <motion.div
        initial={{
          scale: 0,
          rotate: -180,
        }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: 0.4,
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
        className=" relative "
      >
        <CheckCircle className="text-orange-600 w-24 h-24 md:w-28 md:h-28" />

        <motion.div
          className="absolute inset-0"
          initial={{
            opacity: 0,
            scale: 0.6,
          }}
          animate={{
            opacity: [0, 0.3, 0.3],
            scale: [1, 0.6, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full rounded-full bg-orange-400 blur-xl " />
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.3,
        }}
        className="text-3xl md:text-4xl font-bold text-orange-700 mt-6"
      >
        Order placed Successfully..
      </motion.h2>

      <motion.p
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.6,
        }}
        className="text-gray-600 mt-3 text-sm  md:text-base max-w-md"
      >
        Thank you for shoping with us! Your order has been placed and is being
        proccessed. You can track its progress in your
        <span className="font-semibold text-orange-700"> My Order </span>
      </motion.p>

      <motion.div
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: [0, -10, 0],
          opacity: 1,
        }}
        transition={{
          delay: 1,
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mt-10"
      >
        <Package className="w-16 h-16 md:w-20 md:h-20 text-orange-500" />
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 1.2,
          duration: 0.4,
        }}
        className="mt-12"
      >
        <Link
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-base font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
          href={"/user/my-order"}
        >
          My Order
        </Link>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;
