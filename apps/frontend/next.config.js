/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode to help with React hooks issues
  // output: 'export',  // Disable static export for development
  distDir: ".next",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Development server configuration
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
  // Headers are not supported with static export
  // Use _headers file for Cloudflare Pages instead
  webpack: (config, { isServer }) => {
    // Fix issues with Firebase and undici
    if (!isServer) {
      // Avoid undici issues by replacing with noop for client-side
      config.resolve.alias = {
        ...config.resolve.alias,
        undici: false,
        // Prevent issues with node modules in the browser
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
      };

      // Ignore specific node modules that cause issues
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

    // Handle Firebase dependencies properly
    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  transpilePackages: [
    "firebase",
    "@firebase/auth",
    "@firebase/app",
    "@firebase/firestore",
  ],
  experimental: {
    // Reduce serialization issues
    serverComponentsExternalPackages: [
      "firebase",
      "@firebase/auth",
      "@firebase/app",
      "@firebase/firestore",
    ],
  },
};

module.exports = nextConfig;
