import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress responses
  compress: true,

  // Reduce bundle size by restricting external packages from server bundles
  serverExternalPackages: ["@supabase/ssr"],

  // Experimental: improve cold-start performance
  experimental: {
    // Keep server actions stable
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
