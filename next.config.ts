import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

   output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
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
  },
  // Configuración de Webpack para resolver problemas con Genkit AI
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Ignorar advertencias específicas de OpenTelemetry y Handlebars
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /require\.extensions is not supported by webpack/,
    ];

    // Configuración para módulos externos (solo en el servidor)
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        // Externals para evitar problemas de bundling en el servidor
        '@opentelemetry/instrumentation',
        '@opentelemetry/sdk-node',
        'handlebars',
        'dotprompt'
      );
    }

    // Configuración de resolve para Node.js modules
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

    // Configuración específica para Genkit AI y dependencias
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Configuración para manejar dependencias dinámicas
    config.module.rules.push({
      test: /node_modules\/@opentelemetry\/instrumentation\/.*\.js$/,
      use: 'null-loader',
    });

    return config;
  },
  // Configuración experimental para mejorar la compatibilidad
  experimental: {
    serverComponentsExternalPackages: [
      '@genkit-ai/googleai',
      '@genkit-ai/next',
      'genkit',
      '@opentelemetry/instrumentation',
      '@opentelemetry/sdk-node',
      'handlebars',
      'dotprompt'
    ],
  },
};

export default nextConfig;
