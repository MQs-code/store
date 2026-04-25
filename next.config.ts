/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [50, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uforinpcxmyppensydum.supabase.co', // Aapka Supabase hostname
      },
      {
        protocol: 'https',
        hostname: 'pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;