"use client";

import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";

function AddGrocery() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br  from-orange-50 to-white py-16 px-4 relative">
      <Link
        href={"/"}
        className="absolute top-6 left-6 flex items-center gap-2 text-orange-700 font-semibold bg-white px-3 py-2 rounded-full shaodw-md hover:bg-orange-100 hover:shadow-lg transition-all "
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden md:flex">Back to home</span>
      </Link>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
        }}
        className="bg-white w-full max-w-2xl  shadow-2xl rounded-3xl border border-green-100 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <PlusCircle className="text-orange-600 w-8 h-8" />
            <h1>Add Your Grocery</h1>
          </div>
          <p className="text-gray-500 text-sm mt-2 text-center ">
            Fill out the details below to add new items...
          </p>
        </div>

        <form className="flex gap-6 flex-col w-full">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Grocery Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="Grocery name "
              id="name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 transition-all"
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddGrocery;
