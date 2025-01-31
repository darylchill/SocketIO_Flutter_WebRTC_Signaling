import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('User connected');

  // Get user-agent (device information)
  const userAgent = socket.handshake.headers['user-agent'];

  if (userAgent.toLowerCase().includes("mobile")) {
    console.log('Mobile device connected');
    socket.emit('device', 'mobile');
  } else {
    console.log('Desktop device connected');
    socket.emit('device', 'desktop');
  }


  // Handle offer
  socket.on('offer', (data) => {
    console.log('Received offer:', data);
    socket.broadcast.emit('offer', data); // Send offer to other user
  });

  // Handle answer
  socket.on('answer', (data) => {
    console.log('Received answer:', data);
    socket.broadcast.emit('answer', data); // Send answer back to the sender
  });

  // Handle ICE candidate
  socket.on('iceCandidate', (data) => {
    console.log('Received ICE Candidate:', data);
    socket.broadcast.emit('iceCandidate', data); // Send ICE candidate to the other peer
  });

  

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


server.listen(3000, () => {
  console.log('Signaling server running on http://localhost:3000');
});