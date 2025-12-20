"use client";

import {
  Cross,
  LogOut,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence, motion, scale } from "motion/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}

function Navbar({ user }: { user: IUser }) {
  const [open, setOpen] = useState(false);
  const [searchbarOpen, setSearchbarOpen] = useState(false);
  const profileDropDown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      //clicking outside
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-orange-500 to-orange-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-15 px-4">
      <Link
        href={"/"}
        className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform duration-200"
      >
        Quick Drop
      </Link>

      <form className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg">
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search ..."
          className="w-full outline-none text-gray-700 placeholder-gray-400"
        />
      </form>

      <div className="flex items-center gap-3 md:gap-6 relative">
        {/* search icon for small devices */}
        <div
          className=" md:hidden relative bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-105 transition-all"
          onClick={() => setSearchbarOpen(!searchbarOpen)}
        >
          <Search />
        </div>
        <Link
          href={""}
          className="relative bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-105 transition-all"
        >
          <ShoppingCart className="text-orange-600 w-6 h-6" />
          <span
            className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow
		"
          >
            0
          </span>
        </Link>

        <div className="relative" ref={profileDropDown}>
          <div
            onClick={() => setOpen(!open)}
            className="
			cursor-pointer
		bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform
		relative
		"
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt="user"
                fill
                className="object-cover rounded-full "
              />
            ) : (
              <User />
            )}
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 10,
                  scale: 1,
                }}
                transition={{
                  duration: 0.4,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border- border-gray-200 p-3 z-999"
              >
                <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                  <div
                    onClick={() => setOpen(!open)}
                    className="
			cursor-pointer
		bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform
		relative
		"
                  >
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt="user"
                        fill
                        className="object-cover rounded-full "
                      />
                    ) : (
                      <User />
                    )}
                  </div>

                  <div>
                    <div className="text-gray-800 font-semibold uppercase">
                      {user.name}
                    </div>
                    <p className=" text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                <div className="w-[95%] mx-auto h-px bg-gray-400 my-1"></div>

                <Link
                  onClick={() => setOpen(!open)}
                  href={""}
                  className="flex items-center gap-2 py-3 px-3 hover:bg-orange-50 rounded-lg text-gray-700 font-medium transition-all duration-200"
                >
                  <Package className="w-5 h-5 text-green-600" />
                  My Orders
                </Link>

                <button
                  onClick={() => {
                    setOpen(false);
                    signOut({
                      callbackUrl: "/auth/login",
                    });
                  }}
                  className="flex items-center w-full text-left px-3 py-3 gap-2 hover:bg-red-50 rounded-lg text-gray-700 font-medium"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {searchbarOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 10,
                  scale: 1,
                }}
                transition={{
                  duration: 0.4,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                }}
                className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40 flex items-center px-4 py-2"
              >
                <Search className="text-gray-500 w-5 h-5 mr-2" />
                <form action="" className="flex grow">
                  <input
                    type="text"
                    placeholder="Search .."
                    className="w-full outline-none text-gray-700"
                  />

                  <button
                    onClick={() => setSearchbarOpen(!searchbarOpen)}
                    type="button"
                  >
                    <X className="text-gray-500 w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
