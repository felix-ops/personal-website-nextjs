import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pixabay.com",
        pathname: "/**", // Allow all paths under pixabay.com
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**", // Allow all paths under cdn.pixabay.com
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // Allow all paths under images.unsplash.com
      },
    ],
  },
};

export default nextConfig;
