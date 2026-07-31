import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only the GitHub avatar is loaded remotely. Project screenshots should
    // live in /public so they are optimised at build time.
    remotePatterns: [
      { protocol: "https", hostname: "github.com", pathname: "/*.png" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
