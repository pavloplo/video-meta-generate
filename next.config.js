/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // TODO: Remove picsum.photos when switching to real AI-generated thumbnails
      // This is only used for mock/development thumbnails
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
