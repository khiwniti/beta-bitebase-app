const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: ".next",
  trailingSlash: false,
  output: "standalone",
  images: {
    unoptimized: true,
  },

  // Server configuration for development
  experimental: {
    // Removed deprecated serverComponentsExternalPackages
  },

  // Production-ready headers for security and CORS
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
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
            value: "Content-Type, Authorization, X-Requested-With",
          },
        ],
      },
    ];
  },

  // Webpack configuration for Firebase and Node.js compatibility
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

  // Firebase packages should be external to server components
  // This prevents bundling issues and follows Next.js 15 best practices
  serverExternalPackages: [
    "firebase",
    "@firebase/auth",
    "@firebase/app",
    "@firebase/firestore",
  ],
};

module.exports = withNextIntl(nextConfig);
