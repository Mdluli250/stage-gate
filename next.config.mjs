/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'www.gravatar.com' },
      { protocol: 'https', hostname: 'graph.microsoft.com' }
    ]
  }
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
