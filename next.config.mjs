/** @type {import('next').NextConfig} */
const rewrites = () => {
  return [
    {
      source: "/api/create",
      destination: "https://pixelcard-alpha.up.railway.app/create",
    },
  ];
};

const nextConfig = {
  rewrites,
};

export default nextConfig;
