import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: '/**'
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: '/**'
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: '/**'
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
        pathname: '/**'
      },
    ],
  },
}

export default nextConfig;
