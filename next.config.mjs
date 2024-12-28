/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.cyberpunk.net",
      },
    ],
  },
};

export default nextConfig;
