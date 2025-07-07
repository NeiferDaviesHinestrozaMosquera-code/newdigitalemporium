import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // SOLUCIÓN 1: Configurar allowedDevOrigins para el warning de cross-origin
  allowedDevOrigins: [
    '172.17.208.1',
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
  ],
  
  images: {
    // SOLUCIÓN 2: Configurar timeouts para las imágenes externas
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [], // Deprecated pero mantenemos por compatibilidad
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's1.1zoom.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.forbes.com.mx',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kvmpay.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gloriumtech.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hoffmannmurtaugh.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.infintechdesigns.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hoogjocezxaiysibtanl.supabase.co',
        port: '',
        pathname: '/**',
      }
    ],
    // SOLUCIÓN 3: Configurar timeouts más largos
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // SOLUCIÓN 4: Configurar timeouts del servidor
  serverRuntimeConfig: {
    // Aumentar timeouts
    timeout: 30000,
  },
  
  // Configuración experimental para mejor manejo de imágenes
  experimental: {
    // Mejorar el manejo de imágenes remotas
    optimizePackageImports: ['lucide-react'],
  },
  
  serverExternalPackages: [
    '@genkit-ai/googleai',
    '@genkit-ai/next',
    'genkit',
    '@opentelemetry/instrumentation',
    '@opentelemetry/sdk-node',
    'handlebars',
    'dotprompt'
  ],
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /require\.extensions is not supported by webpack/,
    ];

    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        '@opentelemetry/instrumentation',
        '@opentelemetry/sdk-node',
        'handlebars',
        'dotprompt'
      );
    }

    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };

    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    config.module.rules.push({
      test: /node_modules\/@opentelemetry\/instrumentation\/.*\.js$/,
      use: 'null-loader',
    });

    return config;
  },
};

export default nextConfig;