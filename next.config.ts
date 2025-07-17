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
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "via.placeholder.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "kastner.io",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
