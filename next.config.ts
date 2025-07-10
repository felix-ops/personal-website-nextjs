import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    domains: ['pixabay.com',"images.unsplash.com"],
  },
};

export default nextConfig;
