/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: ".next",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Production-ready headers for security and CORS
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  // Webpack configuration for Firebase compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        undici: false,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
      };

      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
      };
    }

    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  // Firebase packages handled as external for server-side rendering
  // This prevents bundling conflicts in Next.js 15
  serverExternalPackages: [
    "firebase",
    "@firebase/auth",
    "@firebase/app",
    "@firebase/firestore",
  ],
};

module.exports = nextConfig;
