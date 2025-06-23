const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // allow all for dev; restrict in prod
    methods: ['GET', 'POST']
  }
});

let viewerCount = 0;

io.on('connection', (socket) => {
  viewerCount++;
  io.emit('viewer_count', viewerCount);

  socket.on('join_page', () => {
    // can add logic per page if needed
  });

  socket.on('leave_page', () => {
    viewerCount = Math.max(viewerCount - 1, 0);
    io.emit('viewer_count', viewerCount);
  });

  socket.on('disconnect', () => {
    viewerCount = Math.max(viewerCount - 1, 0);
    io.emit('viewer_count', viewerCount);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
