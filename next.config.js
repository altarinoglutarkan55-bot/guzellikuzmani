/** @type {import("next").NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Build sırasında ESLint error'ları build'i düşürmesin
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
