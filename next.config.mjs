/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'e-learning-bucket-1.s3.ap-south-1.amazonaws.com',
        pathname: '/**' // Matches all paths
      }
    ]
  }
}

export default nextConfig
