"use client";
import {
  ArrowLeft,
  EyeIcon,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  LogIn,
  Mail,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

import googleIcon from "../../public/assets/images/google-icon.avif";
import Link from "next/link";
import logger from "@/helper_functions/logger";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type propType = {
  prevStep: (s: number) => void;
};

function RegisterForm({ prevStep }: propType) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const registerSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      logger.log("response ", response);
      router.replace("/auth/login");
    } catch (err) {
      logger.error("Error occure in register handler", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <div
        onClick={() => prevStep(1)}
        className="absolute top-5 left-4 flex items-center gap-2 text-orange-700 hover:text-orange-600 transition-colors cursor-pointer"
      >
        <ArrowLeft />
        <span className="font-medium">Back</span>
      </div>

      <motion.h1
        initial={{
          y: -10,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="md:text-4xl text-3xl text-center font-extrabold text-orange-700 mb-2"
      >
        Create Account
      </motion.h1>
      <p className="text-gray-600 mb-8 flex items-center gap-2">
        Join Quick Drop today <Leaf className="w-5 h-5 text-orange-600 " />
      </p>

      <motion.form
        onSubmit={registerSubmitHandler}
        className="flex flex-col gap-5 w-full max-w-sm"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        <div className="relative">
          <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border broder-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 
			focus:ring-2 focus:ring-orange-500 focus-outline-none"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border broder-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 
			focus:ring-2 focus:ring-orange-500 focus-outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Your Password"
            className="w-full border broder-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 
			focus:ring-2 focus:ring-orange-500 focus-outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button
            type="button"
            className="absolute top-3.5 right-3 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>

          {/* submit button */}

          {(() => {
            const formValidation =
              name !== "" && email !== "" && password !== "";

            return (
              <button
                disabled={!formValidation || loading}
                className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 my-4 ${
                  formValidation
                    ? "bg-orange-700 hover:bg-orange-600 text-white cursor-pointer"
                    : " bg-gray-300 text-gray-500 cursor-not cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Register"
                )}
              </button>
            );
          })()}

          {/* divider */}

          <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
            <span className="flex-1 h-px bg-gray-200"></span>
            OR
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          {/* google buttton */}

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transtion-all duration-200 cursor-pointer my-4"
          >
            <Image
              src={googleIcon.src}
              width={20}
              height={20}
              alt="google Icon"
            />
            Continue With Google
          </button>
        </div>
      </motion.form>
      <p className="text-gray-600 mt-6 text-sm flex items-center gap-1 ">
        Already have an Account? <LogIn className="w-4 h-4 " />
        <Link
          href={"/auth/login"}
          className="text-orange-600 font-semibold cursor-pointer"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
