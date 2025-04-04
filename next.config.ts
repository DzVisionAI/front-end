// next.config.js

/** @type {import('next').NextConfig} */
import  {withContentlayer} from "next-contentlayer"

const nextConfig = {
  reactStrictMode: true,
  distDir: "build",
  experimental: {
    appDir: true,
  },
};

module.exports = withContentlayer(nextConfig);