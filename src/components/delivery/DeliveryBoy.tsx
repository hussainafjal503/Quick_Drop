"use client";
import axios from "axios";
import { div } from "motion/react-client";
import React, { useEffect, useState } from "react";
import AssignmentCard from "./AssignmentCard";
import { json } from "stream/consumers";

function DeliveryBoy() {
  const [assignementData, setAssignmentData] = useState<any>([]);
  const fetchAssignment = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignements");
      console.log("result :: ", result?.data?.assignement);
      setAssignmentData(result?.data?.assignement);
    } catch (err) {}
  };
  useEffect(() => {
    fetchAssignment();
  }, []);
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-4 ">Delivery Assignments</h2>
        {console.log(JSON.stringify(assignementData))}
        {assignementData &&
          assignementData?.map((a: any, index: any) => (
            <div
              key={index}
              className="p-5 bg-white rounded-xl shadow mb-4 border"
            >
              <p>
                <strong>Order Id # </strong> {a?.orderId?._id?.slice(0, 10)}
              </p>
              <p className="text-gray-500">
                <strong>Address </strong>
                {a?.orderId?.address?.fullAddress}
              </p>

              <div className="flex gap-3 mt-4">
                <button className="flex-1 bg-green-600 text-white py-3 rounded-lg cursor-pointer">
                  Accept
                </button>
                <button className="flex-1 bg-red-600 text-white cursor-pointer py-3 rounded-lg">
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default DeliveryBoy;
