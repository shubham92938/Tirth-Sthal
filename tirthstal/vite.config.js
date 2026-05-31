import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import qrcode from 'qrcode-terminal'
import os from 'os'

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'qrcode-plugin',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          const ip   = getLocalIP();
          const port = server.config.server.port || 5173;
          const url  = `http://${ip}:${port}`;
          console.log('\n  📱 Scan QR code to open on mobile:\n');
          qrcode.generate(url, { small: true });
          console.log(`\n  ➜  Network: \x1b[36m${url}\x1b[0m\n`);
        });
      }
    }
  ],
  server: {
    host: true,
    port: 5173,
  }
})