/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/:path*',
      },
    ]
  },
  // Ensure we're running on port 3000
  server: {
    port: 3000,
  },
}

module.exports = nextConfig
