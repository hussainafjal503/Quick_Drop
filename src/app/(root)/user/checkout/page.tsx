"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building,
  Circle,
  CreditCard,
  CreditCardIcon,
  Home,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import logger from "@/helper_functions/logger";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import useGetUser from "@/hooks/useGetUser";
import { address, mark } from "motion/react-client";
import axios from "axios";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const markerIcon = new L.Icon({
  iconUrl: "/assets/images/image.png",
  iconSize: [40, 40],
  iconAnchor: [24, 40],
});

function Checkout() {
  const router = useRouter();
  useGetUser();
  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, deliveryFee, finalTotal, cartData } = useSelector(
    (state: RootState) => state.cart
  );
  // logger.log("user data in checkout screen ==>", userData);
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData?.name,
        mobile: userData?.mobile,
      }));
    }
  }, [userData]);

  const [position, setPostion] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  //getting co-ordinates;

  const getCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPostion([latitude, longitude]);
        },
        (err) => {
          logger.error("Location error :: ", err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
  };
  useEffect(() => {
    getCoordinates();
  }, []);

  //draggble marker for better animation..
  const DraggableMarker: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      map.setView(position as LatLngExpression, 15, { animate: true });
    }, [position, map]);

    return (
      <Marker
        draggable={true}
        icon={markerIcon}
        position={position as LatLngExpression}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;

            const { lat, lng } = marker.getLatLng();
            setPostion([lat, lng]);
          },
        }}
      />
    );
  };
  //   location fetching function with co-ordinates..
  const fetchAddress = async () => {
    try {
      if (!position) return;
      const result = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
      );

      logger.log("result of location ", result?.data);

      const address = result?.data?.address;
      setAddress((prev) => ({
        ...prev,
        city: address?.city,
        state: address?.state || "New Delhi",
        pincode: address?.postcode,
        fullAddress: result?.data?.display_name,
      }));
    } catch (err) {
      logger.error("unable to fetch address by cords", err);
    } finally {
      setIsSearchLoading(false);
    }
  };
  useEffect(() => {
    fetchAddress();
  }, [position]);

  //seach query
  const handleSearchQuery = async () => {
    setIsSearchLoading(true);
    const provider = new OpenStreetMapProvider();
    const result = await provider.search({ query: searchQuery });
    logger.log("rs ==>", result);
    if (result) {
      setPostion([result[0]?.y, result[0]?.x]);
    }
  };

  const handleCODFunction = async () => {
    if (!position) return;
    const newAddress = {
      ...address,
      latitude: position[0],
      longitude: position[1],
    };

    try {
      const result = await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData?.map((item) => ({
          groceryId: item?._id,
          name: item?.name,
          price: item?.price,
          unit: item?.unit,
          qty: item?.qty,
        })),
        totalAmount: finalTotal,
        address: newAddress,
        paymentMethod,
      });

      // logger.log("proceed order response : =>", result);
      router.push("/user/order-success");
    } catch (Err) {
      logger.error("Error occured in handle code function", Err);
    }
  };

  const handleOnlineTransaction = async () => {};

  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        onClick={() => router.push("/user/cart")}
        className="absolute left-0 top-2 flex items-center gap-2 text-orange-700 hover:text-orange-800 font-semibold"
        whileTap={{
          scale: 0.8,
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Cart</span>
      </motion.button>

      <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4"
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 ">
            <MapPin className="text-orange-700" />
            Delivery Address
          </h2>

          <div className="space-y-4 ">
            <div className="relative ">
              <User
                className="absolute left-3 top-3 text-orange-600 "
                size={18}
              />
              <input
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, fullName: e.target.value }))
                }
                type="text"
                placeholder="Your Name"
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                value={address.fullName}
              />
            </div>

            <div className="relative ">
              <Phone
                className="absolute left-3 top-3 text-orange-600 "
                size={18}
              />
              <input
                type="text"
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, mobile: e.target.value }))
                }
                placeholder="Mobile"
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                value={address?.mobile}
              />
            </div>

            <div className="relative ">
              <Home
                className="absolute left-3 top-3 text-orange-600 "
                size={18}
              />
              <input
                type="text"
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
                  }))
                }
                placeholder="full Address"
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                value={address?.fullAddress}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="relative ">
                <Building
                  className="absolute left-3 top-3 text-orange-600 "
                  size={18}
                />
                <input
                  type="text"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="City"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  value={address?.city}
                />
              </div>

              <div className="relative ">
                <Navigation
                  className="absolute left-3 top-3 text-orange-600 "
                  size={18}
                />
                <input
                  type="text"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                  placeholder="State"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  value={address?.state}
                />
              </div>

              <div className="relative ">
                <Circle
                  className="absolute left-3 top-3 text-orange-600 "
                  size={18}
                />
                <input
                  type="text"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, pincode: e.target.value }))
                  }
                  placeholder="pincode"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  value={address?.pincode}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <input
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                value={searchQuery}
                type="text"
                placeholder="Search city or area.."
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              />
              <button
                onClick={handleSearchQuery}
                className="bg-orange-600 text-white px-5 rounded-lg transition-all font-medium hover:bg-green-700 cursor-pointer"
              >
                {isSearchLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Search"
                )}
              </button>
            </div>

            <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              {position && (
                <MapContainer
                  className="w-full h-full "
                  center={position as LatLngExpression}
                  zoom={13}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <DraggableMarker />
                </MapContainer>
              )}

              <motion.button
                whileTap={{
                  scale: 0.8,
                }}
                onClick={getCoordinates}
                className="absolute bottom-4 right-4 bg-orange-600 text-white shadow-lg rounded-full p-3 hover:bg-orange-700 transition-all flex items-center justify-center z-999"
              >
                <LocateFixed size={22} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* right */}
        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit "
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-orange-600" />
            <span>Payment Method</span>
          </h2>
          <div className="space-y-4 mb-6">
            <button
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                paymentMethod === "online"
                  ? "border-orange-600 bg-orange-50 shadow-sm"
                  : "hover:bg-gray-50"
              }`}
            >
              <CreditCardIcon className="text-orange-600" />
              <span className="font-medium text-gray-700">
                Pay Online (stripe)
              </span>
            </button>

            <button
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                paymentMethod === "cod"
                  ? "border-orange-600 bg-orange-50 shadow-sm"
                  : "hover:bg-gray-50"
              }`}
            >
              <Truck className="text-orange-600" />
              <span className="font-medium text-gray-700">COD</span>
            </button>
          </div>

          <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
            <div className="flex gap-2 justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="font-semibold text-orange-600 ">
                ₹{subTotal}
              </span>
            </div>
            <div className="flex gap-2 justify-between">
              <span className="font-semibold">Delivery Fee</span>
              <span className="font-semibold text-orange-600 ">
                ₹{deliveryFee}
              </span>
            </div>

            <div className="flex gap-2 justify-between font-bold text-lg border-t pt-3">
              <span className="font-semibold">Final Total</span>
              <span className="font-semibold text-orange-600 ">
                ₹{finalTotal}
              </span>
            </div>
          </div>

          <motion.button
            onClick={() => {
              if (paymentMethod === "cod") handleCODFunction();
              else handleOnlineTransaction();
            }}
            whileTap={{ scale: 0.8 }}
            className="w-full mt-6 bg-orange-600 text-white py-3 transition-all font-semibold rounded-full hover:bg-orange-700 cursor-pointer"
          >
            {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;
