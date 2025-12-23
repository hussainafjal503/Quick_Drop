"use client";
import { Leaf, ShoppingBasket, Smartphone, Truck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { s } from "motion/react-client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function HeroSection() {
  const slides = [
    {
      id: 1,
      icon: (
        <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-orange-700 drop-shadow-lg" />
      ),
      title: "Fresh organic Groceries",
      subtitle:
        "Farm fresh fruits, vegetables, and daily essentials delivered to you.",
      btnText: "Shop Now",
      bg: "https://images.unsplash.com/photo-1741515043161-e97d05e5cfcc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlc2glMjBvcmdhbmljJTIwZ3JvY2VyaWVzfGVufDB8fDB8fHww",
    },
    {
      id: 2,
      icon: (
        <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg" />
      ),
      title: "Fast & Reliable Delivery",
      subtitle: "WE ensure your groceries reach your doorstep in no time.",
      btnText: "Order Now",
      bg: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      icon: (
        <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg" />
      ),
      title: "Fast & Reliable Delivery",
      subtitle: "WE ensure your groceries reach your doorstep in no time.",
      btnText: "Get Started",
      bg: "https://images.unsplash.com/photo-1605447813584-26aeb3f8e6ae?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZyZXNoJTIwb3JnYW5pYyUyMGdyb2Nlcmllc3xlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    let intervalId = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      4000
    );

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-[98%] mx-auto mt-24 h-[80vh] rounded-3xl overflow-hidden shadow-2xl ">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
          }}
          exit={{
            opacity: 0,
          }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide]?.bg}
            fill
            alt="bg"
            priority
            className="object-cover"
          />

          <div className="aboslute inset-0 bg-black/50 backdrop-blur-[1px]" />
        </motion.div>
      </AnimatePresence>

      <div className="absoute inset-0 flex items-center justify-center text-center text-white px-6  ">
        <motion.div
          initial={{
            y: 30,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
          }}
          className="flex flex-col items-center justify-center  gap-6 max-w-3xl"
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-full shadow-lg">
            {slides[currentSlide]?.icon}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            {slides[currentSlide]?.title}
          </h1>

          <h5 className="text-md sm:text-xl md:text-6xl tracking-tight drop-shadow-lg text-gray-200">
            {slides[currentSlide]?.subtitle}
          </h5>

          <motion.button className="mt-4 bg-white text-green-700 hover:bg-green-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 drop-shadow-lg cursor-pointer"  
		  
		  whileHover={{
			scale:1.2
		  }}
		  whileTap={{scale:0.8}}
		  transition={{
			duration:0.2
		  }}
		  >
            <ShoppingBasket className="w-5 h-5" />
            {slides[currentSlide]?.btnText}
          </motion.button>
        </motion.div>
      </div>

	  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">{
		slides.map((_,index)=>(
			<button
			key={index}
			className={`w-3 h-3 rounded-full transition-all ${index==currentSlide ? "bg-white w-6":"bg-white/50"}`}/>
		))
	  }

	  </div>
    </div>
  );
}

export default HeroSection;
