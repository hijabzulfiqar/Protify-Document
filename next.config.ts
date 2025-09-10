import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  output: "standalone",
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default nextConfig;
