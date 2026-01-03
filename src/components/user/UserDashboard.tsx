import React from "react";
import HeroSection from "./HeroSection";
import CategorySlider from "./CategorySlider";
import GroceryItemCard from "./GroceryItemCard";
import dbConnection from "@/utils/dbConnection";
import groceryModel from "@/models/grocery.model";

async function UserDashboard() {
  await dbConnection();
  const grocery = await groceryModel.find({});
  const plainGrocery = JSON.parse(JSON.stringify(grocery));

  return (
    <div className="z-0">
      <HeroSection />
      <CategorySlider />

      <div>
        <h2 className="w-[90%] md:w-[80%] mx-auto mt-10">Grocery Items</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {plainGrocery.map((item: any, index: number) => (
            <GroceryItemCard item={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
