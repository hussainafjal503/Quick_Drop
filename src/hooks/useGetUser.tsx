"use client";
import logger from "@/helper_functions/logger";
import { setUserData } from "@/store/slices/user/reducer";
import { AppDispatch } from "@/store/store";
import axios from "axios";
import { log } from "console";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function useGetUser() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get("/api/getUser");
        logger.log("user detail", result);

        dispatch(setUserData(result?.data?.data));
      } catch (Err) {
        logger.error("Error occured while getting user detail..");
      }
    };
    getUser();
  }, []);
}

export default useGetUser;
