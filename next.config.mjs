/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/about', destination: '/#about', permanent: false },
      { source: '/playground', destination: '/#playground', permanent: false },
      { source: '/work/:slug', destination: '/#:slug', permanent: false },
    ];
  },
};

export default nextConfig;
