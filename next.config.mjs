/** @type {import('next').NextConfig} */
const isCapacitor = process.env.CAPACITOR_BUILD === 'true';

const nextConfig = {
  output: isCapacitor ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  // If building for Capacitor, exclude Route Handlers (.ts) from routes
  pageExtensions: isCapacitor ? ['tsx', 'jsx', 'js'] : ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
