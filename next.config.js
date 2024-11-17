import withPWA from "next-pwa";

const withPWAConfig = withPWA({
  dest: "public",
  swSrc: "/public/custom-service-worker.js",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest.json$/, /app-build-manifest.json$/],
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPWAConfig({
  reactStrictMode: true,
});

export default nextConfig;
