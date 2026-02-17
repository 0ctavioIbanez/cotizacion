/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/cotizacion', // <--- Agrega el nombre de tu repo exacto
  images: {
    unoptimized: true,
  },
};

export default nextConfig;