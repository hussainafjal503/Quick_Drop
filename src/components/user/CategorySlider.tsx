"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Apple,
  Box,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Cookie,
  Flame,
  Heart,
  Home,
  Milk,
  Wheat,
} from "lucide-react";

function CategorySlider() {
  const categories = [
    { id: 1, name: "Fruits & Vegetables", icon: Apple, color: "bg-green-100" },
    { if: 2, name: "Dairy & Egg", icon: Milk, color: "bg-yellow-100" },

    { id: 3, name: "Rice, Atta & Grains", icon: Wheat, color: "bg-orange-100" },

    { id: 4, name: "Snacks & Biscuits", icon: Cookie, color: "bg-pink-100" },

    { id: 5, name: "Beverages & Drinks", icon: Flame, color: "bg-red-100" },
    { id: 6, name: "Personal Care", icon: Coffee, color: "bg-blue-100" },

    {
      id: 7,
      name: "Household Essentials",
      icon: Heart,
      color: "bg-purple-100",
    },
    {
      id: 8,
      name: "Instant & Packaged Food",
      icon: Home,
      color: "bg-lime-100",
    },
    { id: 9, name: "Baby & Pet Care", icon: Box, color: "bg-teal-100" },
  ];

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction == "left" ? -300 : 300;
    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const checkScroll = () => {
    if (!scrollRef) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setShowLeft(scrollLeft > 0 ? true : false);
    setShowRight(scrollLeft + clientWidth <= scrollWidth - 5 ? true : false);
  };

  useEffect(() => {
    scrollRef.current?.addEventListener("scroll", checkScroll);

    checkScroll();
    return () => removeEventListener("scroll", checkScroll);
  }, []);

  const autoScroll = () => {
    if (!scrollRef) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    if (scrollLeft + clientWidth >= scrollWidth - 5) {
      scrollRef.current?.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      scrollRef.current?.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(autoScroll, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <motion.div
      className="w-[90%] md:w-[80%] mx-auto mt-10 relative"
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: false,
        amount: 0.5,
      }}
      transition={{
        duration: 0.6,
      }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-6 text-center">
        Shop by Category
      </h2>
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-green-700" />
        </button>
      )}

      <div
        className="flex gap-6 overflow-x-auto px-10 pb-4 scrollbar-hide scroll-smooth"
        ref={scrollRef}
      >
        {categories &&
          categories?.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div

              
                key={index}
                className={`min-w-[150px] md:min-w-[180px] flex flex-col items-center justify-center rounded-2xl ${cat.color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
              >
                <div className="flex flex-col items-center justify-center p-5">
                  <Icon className="w-10 h-10 text-green-700 mb-3" />
                  <p className="text-center text-sm md:text-base font-semibold text-gray-700">
                    {cat.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
      </div>

      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-6 h-6 text-green-700" />
        </button>
      )}
    </motion.div>
  );
}

export default CategorySlider;
