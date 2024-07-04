import withSvgr from 'next-plugin-svgr';

/** @type {import('next').NextConfig} */
const nextConfig = withSvgr({
  experimental: {
    optimizePackageImports: ['ai', 'lucide-react'],
  },
  rewrites: async () => ({
    fallback: [
      {
        source: '/api/:slug*',
        destination: 'https://tidbai-dev.htapdb.com/api/:slug*',
      }
    ],
  })
});

export default nextConfig;
