// eslint-disable-next-line @typescript-eslint/no-require-imports
const withpwa = require("next-pwa")({
  dest: "public",
  swSrc: "/public/custom-service-worker.js",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest.json$/, /app-build-manifest.json$/],
  disable: process.env.NODE_ENV !== "production"
})
const nextConfig = withpwa({
  reactStrictMode: true
});
module.exports = nextConfig;
