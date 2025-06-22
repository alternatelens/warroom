import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, { path: '/socket.io' });

  let viewerCount = 0;
  io.on('connection', (socket) => {
    viewerCount++;
    io.emit('viewer_count', viewerCount);

    socket.on('disconnect', () => {
      viewerCount = Math.max(viewerCount - 1, 0);
      io.emit('viewer_count', viewerCount);
    });
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server with Socket.IO ready on port ${PORT}`);
  });
});
