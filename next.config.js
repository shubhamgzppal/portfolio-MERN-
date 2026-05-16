// next.config.js
import fs from 'fs';
import path from 'path';

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Copy pdf.worker.min.mjs to public folder on build
      const workerPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
      const publicPath = path.join(process.cwd(), 'public/pdf.worker.min.mjs');
      
      try {
        if (fs.existsSync(workerPath) && !fs.existsSync(publicPath)) {
          fs.copyFileSync(workerPath, publicPath);
        }
      } catch (err) {
        console.error('Failed to copy PDF worker:', err);
      }
    }
    return config;
  },
};

export default nextConfig;
