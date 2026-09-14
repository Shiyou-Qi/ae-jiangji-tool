/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  // 截图与演示时不要那个开发态浮标
  devIndicators: false,
};

export default nextConfig;
