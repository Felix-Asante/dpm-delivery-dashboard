/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [{ hostname: process.env.NEXT_PUBLIC_REMOTE_IMAGE_HOST }],
	},
};

module.exports = nextConfig;
