import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	devIndicators: false,

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.jsdelivr.net",
				pathname: "/gh/felix-ops/website-assets/**",
			},
			{
				protocol: "https",
				hostname: "opengraph.githubassets.com",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
