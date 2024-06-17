/** @type {import('next').NextConfig} */
const rewrites = () => {
  return [
    {
      source: "/api/create",
      destination: "https://pc.baojiaoza.fun/create",
    },
  ];
};

const nextConfig = {
  rewrites,
};

export default nextConfig;
