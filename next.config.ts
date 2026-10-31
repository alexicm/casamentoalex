import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dynamic RSVP, auth cookies and personal invite tokens need request-time rendering.
  cacheComponents: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
