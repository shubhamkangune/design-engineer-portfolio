import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any source (for base64 and external URLs)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Modern formats for better compression
    formats: ["image/avif", "image/webp"],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Image sizes matching card heights
    imageSizes: [224, 256, 384, 512],
    // Minimize image size for bandwidth savings
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
};

export default nextConfig;
