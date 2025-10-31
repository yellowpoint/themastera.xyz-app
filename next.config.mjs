/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // remotePatterns: [new URL('https://image.mux.com/**')],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.mux.com',
        port: '',
        pathname: '',
      },
    ],
  },
};

export default nextConfig;
