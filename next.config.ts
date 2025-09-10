import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure API routes are not statically analyzed during build
  serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  // Optimize for serverless deployment
  output: "standalone",
};

export default nextConfig;
