import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/escritorios-elevables",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
