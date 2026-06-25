import type { NextConfig } from 'next';
const nextConfig: NextConfig = { output: 'standalone', transpilePackages: ['@ado/contracts'] };
export default nextConfig;
