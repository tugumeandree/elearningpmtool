/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "encrypted-tbn0.gstatic.com"
			},
			{
				protocol: "https",
				hostname: "www.enabel.be"
			}
		]
	},
	webpack: (config, { dev }) => {
		if (dev) {
			// Avoid stale/corrupted pack cache on Windows paths with spaces.
			config.cache = { type: "memory" }
		}
		return config
	}
}

export default nextConfig
