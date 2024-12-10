import http from "http";
import connectDB from "./db/db.js";
import app from "./app.js";
import { Server } from 'socket.io';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

io.on('connection', (socket) => {

  socket.on('send_message', ({ recipientId, message }) => {
    socket.broadcast.emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    try {
        await connectDB();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
});

export { io };
