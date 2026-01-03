"use client";

import { ArrowLeft, Loader, PlusCircle, Upload } from "lucide-react";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import logger from "@/helper_functions/logger";
import axios from "axios";

function AddGrocery() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [preview, setPreview] = useState<string | null>();
  const [backendImage, setBackendImage] = useState<Blob | null>();

  const categories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Rice, Atta & Grains",
    "Snacks & Biscuits",
    "Beverages & Drinks",
    "Personal Care",
    "Household Essentials",
    "Instant & Packaged Food",
    "Baby & Pet Care",
  ];

  const units = ["kg", "g", "ml", "l", "piece", "pack"];

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length == 0) return;

    let file = files[0];

    setBackendImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("unit", unit);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post("/api/admin/add-grocery", formData);
      logger.log("result of response :: ", result);
    } catch (Err) {
      logger.error("Error Occured in add grocery ::", Err);
    } finally {
      setLoading(false);
    }
  };
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

        <form
          onSubmit={handleFormSubmit}
          className="flex gap-6 flex-col w-full"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Grocery Name <span className="text-red-500">*</span>
            </label>

            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              value={name}
              placeholder="Grocery name "
              id="name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
            <div className="">
              <label
                htmlFor=""
                className="block text-gray-700 font-medium mb-1"
              >
                Category <span className="text-red-500 ">*</span>
              </label>

              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                name="category"
                id="category"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400 outline-none transition-all bg-white"
              >
                <option value={""}>Select Category</option>

                {categories &&
                  categories?.map((cat, index) => (
                    <option value={cat} key={index}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>
            <div className="">
              <label
                htmlFor="unit"
                className="block text-gray-700 font-medium mb-1"
              >
                Unit <span className="text-red-500 ">*</span>
              </label>

              <select
                onChange={(e) => setUnit(e.target.value)}
                value={unit}
                name="unit"
                id="unit"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400 outline-none transition-all bg-white"
              >
                <option value={""}>Select Unit</option>

                {units &&
                  units?.map((cat, index) => (
                    <option value={cat} key={index}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium mb-1"
            >
              Price <span className="text-red-500">*</span>
            </label>

            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="text"
              placeholder="eg: 45.45 "
              id="price"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <label
              htmlFor="image"
              className=" cursor-pointer flex items-center justify-center gap-2 bg-green-50 text-orange-500 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-orange-100 transition-all w-full sm:w-auto"
            >
              <Upload className="w-5 h-5" />
              Upload image
            </label>

            <input
              onChange={handleImageChange}
              type="file"
              accept="image/*"
              //   placeholder="eg: 45.45 "
              id="image"
              //   className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 transition-all"
            />

            {preview && (
              <Image
                src={preview}
                width={100}
                height={100}
                alt="image"
                className="rounded-xl shadow-md border border-gray-400 object-cover "
              />
            )}
          </div>

          <motion.button
            disabled={loading}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.9,
            }}
            className="cursor-pointer mt-4 w-full  bg-linear-to-r from-orange-500 to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 transition-all flex items-center justify-center gap-2 text-center"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              "Add Grocery"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default AddGrocery;
