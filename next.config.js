/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: [
      "http://10.165.3.220:3000", // your LAN/dev IP
      "http://localhost:3000",    // keep localhost too
    ],
  },
}

export default nextConfig
