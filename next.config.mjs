/** @type {import('next').NextConfig} */
const nextConfig = {
      basePath: '/app1',
  assetPrefix: '/app1/',
  output: 'standalone', // recommended for Docker
};

export default nextConfig;
