import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@daytrading/polygon", "@daytrading/strategy", "@daytrading/ai"],
  serverExternalPackages: ["better-sqlite3"],
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
