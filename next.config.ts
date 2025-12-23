import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      {
        hostname: "images.unsplash.com",
      },
    ],

    domains: [
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "images.unsplash.com",
    ],
  },
};

export default nextConfig;
