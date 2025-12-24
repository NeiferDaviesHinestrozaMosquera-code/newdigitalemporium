
import type { NextConfig } from 'next';

const serverOnlyPackages = [
  '@genkit-ai/googleai',
  '@genkit-ai/next',
  'genkit',
  '@opentelemetry/instrumentation',
  '@opentelemetry/sdk-node',
  'handlebars',
  'dotprompt',
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Replace server-only modules with an empty module on the client side.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...Object.fromEntries(serverOnlyPackages.map(pkg => [pkg, false]))
      };
    }
    return config;
  },
};

export default nextConfig;
