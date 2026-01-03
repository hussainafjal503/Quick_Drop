"use client";
import { ArrowLeft, Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { div } from "motion/react-client";
import Image from "next/image";
import {
  decreaseQty,
  increaseQty,
  removeFromCart,
} from "@/store/slices/cart/cartSlice";
import { useRouter } from "next/navigation";

function page() {
  const { cartData, subTotal, finalTotal, deliveryFee } = useSelector(
    (state: RootState) => state.cart
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <div className="w-[95%] sm-w-[90%] md:w-[80%] mx-auto mt-8 mb-24 relative">
      <Link
        href="/"
        className="absolute -top-2 left-0 flex items-center gap-2 text-orange-700 hover:text-green-800 font-medium transition-all"
      >
        <ArrowLeft className="" size={20} />
        <span className="hidden md:inline">Back to home</span>
      </Link>

      <motion.h2
        className="text-2xl sm:text3xl md:text-4xl font-bold text-orange-700 text-center mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 0.4 }}
      >
        Your Shoping cart
      </motion.h2>

      {cartData?.length == 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.4 }}
          className="text-center py-20 bg-white rounded-2xl shadow-md"
        >
          <ShoppingBasket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-60 text-lg mb-6">
            Your cart is empty add some Grocery to continue shoping
          </p>
          <Link
            className="bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all inline-block font-medium"
            href={"/"}
          >
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="my-8">
            <AnimatePresence>
              {cartData?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 30,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-100 gap-8 my-2"
                >
                  <div className="relative w-28 h-28 sm:h-24 md:w-28 shrink-0 rounded-xl overflow-hidden bg-gray-50">
                    <Image
                      src={item?.image}
                      alt={item?.name}
                      fill
                      className="object-contain  p-3 transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex-1 text-center sm:text-left ">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                      {item?.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {item?.unit}
                    </p>
                    <p className="text-orange-700 font-bold mt-1 text-sm sm:text-base">
                      {" "}
                      ₹{Number(item?.price) * item?.qty}
                    </p>
                  </div>

                  <div className="flex items-center justify-center sm:justify-end gap-3 mt-3 sm:mt-0 bg-gray-50 px-3 py-2 rounded-full">
                    <button
                      onClick={() => dispatch(decreaseQty(item?._id))}
                      className="bg-white p-1.5 rounded-full hover:bg-green-100 transition-all border border-gray-200"
                    >
                      <Minus className="text-orange-700" size={14} />
                    </button>
                    <span className="font-semibold text-center text-gray-800 w-6">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => dispatch(increaseQty(item?._id))}
                      className="bg-white p-1.5 rounded-full hover:bg-green-100 transition-all border border-gray-200"
                    >
                      <Plus className="text-orange-700" size={14} />
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={() => dispatch(removeFromCart(item?._id))}
                      className="sm:ml-4 mt-3 sm:mt-0 text-red-500 hover:text-red-700 transition-all cursor-pointer"
                    >
                      <Trash2 size={18} className="" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-24 border border-gray-100 flex flex-col"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mg-4 ">
              Order Summary
            </h2>
            <div className="space-y-3 text-gray-700 text-sm sm:text-base">
              <div className="flex justify-between ">
                <span>Subtotal</span>
                <span className="font-semibold text-orange-700">
                  ₹ {subTotal}
                </span>
              </div>

              <div className="flex justify-between ">
                <span>Delivery Fee</span>
                <span className="font-semibold text-orange-700">
                  ₹ {deliveryFee}
                </span>
              </div>

              <hr className="my-3" />
              <div className="flex justify-between font-bold text-lg ">
                <span>Final Total</span>
                <span className="font-semibold text-orange-700">
                  ₹ {finalTotal}
                </span>
              </div>
            </div>

            <motion.button
              onClick={() => router.push("/user/checkout")}
              whileTap={{
                scale: 0.8,
              }}
              className="w-full mt-6 bg-orange-600 cursor-pointer text-white py-3 rounded-full hover:green-700 transition-all duration-200"
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default page;
