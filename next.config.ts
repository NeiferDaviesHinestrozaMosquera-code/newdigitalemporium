import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuración de desarrollo
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Deshabilitar source maps para evitar advertencias
  productionBrowserSourceMaps: false,
  
  // Configuración de seguridad y acceso
  allowedDevOrigins: [
    '172.17.208.1',
    '192.168.56.1',
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
  ],
  
  // Configuración de imágenes optimizada
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        //hostname: 'placehold.co',
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
      },
      {
        protocol: 'https',
        hostname: 'mir-s3-cdn-cf.behance.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a5.behance.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pro2-bar-s3-cdn-cf.myportfolio.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },
  
  // Configuración del servidor
  serverRuntimeConfig: {
    timeout: 30000,
  },
  
  // Configuración experimental
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Paquetes externos del servidor
  serverExternalPackages: [
    '@genkit-ai/googleai',
    '@genkit-ai/next',
    'genkit',
    '@opentelemetry/instrumentation',
    '@opentelemetry/sdk-node',
    'handlebars',
    'dotprompt'
  ],
  
  // Configuración de webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Ignorar advertencias específicas
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /require\.extensions is not supported by webpack/,
    ];

    // Configuración del servidor
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        '@opentelemetry/instrumentation',
        '@opentelemetry/sdk-node',
        'handlebars',
        'dotprompt'
      );
    }

    // Configuración de resolución
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

    // Reglas adicionales de módulos
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Configuración especial para @opentelemetry
    config.module.rules.push({
      test: /node_modules\/@opentelemetry\/instrumentation\/.*\.js$/,
      use: 'null-loader',
    });

    // Deshabilitar source maps en desarrollo para evitar advertencias
    if (dev) {
      config.devtool = false;
    }

    return config;
  },
};

export default nextConfig;