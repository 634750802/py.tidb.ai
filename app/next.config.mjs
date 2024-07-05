import withSvgr from 'next-plugin-svgr';

/** @type {import('next').NextConfig} */
const nextConfig = withSvgr({
  transpilePackages: ['monaco-editor'],
  experimental: {
    optimizePackageImports: ['ai', 'lucide-react'],
    // https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
    missingSuspenseWithCSRBailout: false,
  },
});

export default nextConfig;
