import type { NextConfig } from "next";

/**
 * Static export configuration — the site deploys to GitHub Pages
 * (user site, served at the domain root, so no basePath is needed).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
