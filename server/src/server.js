import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSockets } from './sockets/index.js';
import dotenv from 'dotenv';
import { seedGroups } from './utils/seedGroups.js';

dotenv.config();

const PORT = process.env.PORT;

// Create HTTP server
const server = http.createServer(app);

// Initialize Sockets
const io = initSockets(server);

app.set('io', io);

// Connect DB then Start Server
connectDB().then(async () => {
  await seedGroups();
  server.listen(PORT, () => {
    console.log(`GentelAid API running on port ${PORT}`);
  });
});
