import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    max: {
      stale: 300,
      revalidate: 86400,
      expire: 86400,
    },
    settings: {
      stale: 60,
      revalidate: 3600,
      expire: 3600,
    },
    frequent: {
      stale: 30,
      revalidate: 300,
      expire: 600,
    },
  },
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
