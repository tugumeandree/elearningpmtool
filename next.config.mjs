/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { dev }) => {
		if (dev) {
			// Avoid stale/corrupted pack cache on Windows paths with spaces.
			config.cache = { type: "memory" }
		}
		return config
	}
}

export default nextConfig
