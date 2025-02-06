import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // serverExternalPackages: ["node:fs", "node:path"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.jsonl$/,
      use: "raw-loader",
    });
    return config;
  },
  //
  // assetPrefix: "https://bugzmanov.github.io/pkt-tui-web/",
};

module.exports = nextConfig;
export default nextConfig;
