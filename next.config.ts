import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compress: true,

    experimental: {
        optimizePackageImports: ["@iconify/react", "framer-motion", "date-fns", "lucide-react"],
    },

    images: {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60 * 60 * 24 * 7,
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
            { protocol: "https", hostname: "example.com", pathname: "/**" },
            { protocol: "https", hostname: "www.google.com", pathname: "/**" },
            { protocol: "https", hostname: "logo.clearbit.com", pathname: "/**" },
        ],
    },
}

export default nextConfig;
