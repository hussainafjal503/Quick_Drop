"use client";

import React, { useEffect, useState } from "react";

import { motion } from "motion/react";
import { ArrowRight, Bike, User, UserCog } from "lucide-react";
import logger from "@/helper_functions/logger";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
function EditRoleMobile() {
  const [roles, setRoles] = useState([
    {
      id: "admin",
      label: "Admin",
      icon: <UserCog />,
    },
    {
      id: "user",
      label: "User",
      icon: <User />,
    },
    {
      id: "deliveryBoy",
      label: "Delivery Partner",
      icon: <Bike />,
    },
  ]);

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const { update } = useSession();

  const router = useRouter();
  const handleEdit = async () => {
    try {
      const result = await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });

      await update({ role: selectedRole });
      logger.log("Result", result.data);
      router.replace("/");
    } catch (err) {
      logger.error("Error occured in handleEdit Handler :: ", err);
    }
  };

  useEffect(() => {
    checkForAdminHandler();
  }, []);

  const checkForAdminHandler = async () => {
    try {
      const result = await axios.get("/api/check-for-admin");
      if (result?.data?.adminExists) {
        setRoles((prev) => prev.filter((role) => role.id != "admin"));
      }
    } catch (err) {
      logger.error("Error occured while checking that admin exist or not");
    }
  };
  return (
    <div className="flex flex-col min-h-screen p-6 w-full items-center">
      <motion.h1
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="text-3xl md:text-4xl font-extrabold text-center text-orange-700"
      >
        Select Your Role
      </motion.h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {roles?.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <motion.div
              key={role?.id}
              onClick={() => setSelectedRole(role?.id)}
              whileTap={{
                scale: 0.9,
              }}
              className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-orange-600 bg-orange-200 shadow-lg font-semibold"
                  : "border-gray-300 bg-white hover:border-orange-500"
              } `}
            >
              <span className="">{role.icon}</span>
              <span>{role.label}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="flex flex-col items-center mt-10"
      >
        <label htmlFor="mobile" className="text-gray-700 font-medium mb-2">
          Mobile No.
        </label>

        <input
          onChange={(e) => setMobile(e.target.value)}
          type="tel"
          id="mobile"
          name="mobile"
          maxLength={10}
          value={mobile}
          placeholder="Enter Your Mobile No."
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-700 focus:outline-none text-gray-800 "
        />
      </motion.div>

      <motion.button
        disabled={!selectedRole || mobile.length != 10}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.7,
          type: "spring",
          stiffness: 90,
          damping: 14,
        }}
        className={`mt-10 inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 w-50 ${
          selectedRole && mobile.length === 10
            ? "bg-orange-600 hover:bg-orange-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        } `}
        onClick={handleEdit}
      >
        Quick Explore
        <ArrowRight />
      </motion.button>
    </div>
  );
}

export default EditRoleMobile;
