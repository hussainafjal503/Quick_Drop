import { auth } from "@/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";
import DeliveryBoyDashborad from "@/components/delivery/DeliveryBoyDashborad";
import EditRoleMobile from "@/components/EditRoleMobile";
import GEoUpdateer from "@/components/GEoUpdateer";
import Navbar from "@/components/Navbar";
import UserDashboard from "@/components/user/UserDashboard";
import logger from "@/helper_functions/logger";
import userModel from "@/models/user.model";
import dbConnection from "@/utils/dbConnection";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  await dbConnection();
  const session = await auth();
  // logger.log(session)
  const userData = await userModel.findById(session?.user?.id);

  // logger.log(userData);
  if (!userData) {
    redirect("/auth/login");
  }

  const inCompleteUser =
    !userData.mobile ||
    !userData.role ||
    (!userData.mobile && userData.role == "user");

  if (inCompleteUser) {
    return <EditRoleMobile />;
  }
  const plainUser = JSON.parse(JSON.stringify(userData));
  console.log("use data", userData.role);

  return (
    <div className="relative">
      <Navbar user={plainUser} />
      <GEoUpdateer userId={plainUser._id} />

      {userData.role == "user" ? (
        <UserDashboard />
      ) : // null

      userData.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoyDashborad />
      )}
    </div>
  );
}

export default page;
