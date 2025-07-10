// server.js – Socket.io chat server (fixed: join default room + accurate users_list)

const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');

dotenv.config();

/* ---------- express & socket ---------- */
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- in‑memory state ---------- */
const users       = {};   // socket.id ➜ { id, username }
const messages    = [];   // capped history
const typingUsers = {};   // socket.id ➜ username

/* ---------- socket.io logic ---------- */
io.on('connection', (socket) => {
  console.log('🔌  connected:', socket.id);

  /* ---- join ---- */
  socket.on('user_join', ({ username }) => {
    users[socket.id] = { id: socket.id, username };

    // 1. join the default room so the sender echoes messages
    socket.join('general');

    // 2. confirm join to this socket
    socket.emit('user_joined_success', { user: users[socket.id] });

    // 3. send full list to this socket, then broadcast to everyone else
    const list = Object.values(users);
    socket.emit('users_list', list);
    socket.broadcast.emit('users_list', list);

    console.log('✅ join:', username);
  });

  /* ---- chat message ---- */
  socket.on('send_message', ({ content, room = 'general', timestamp }) => {
    const msg = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      content,
      room,
      timestamp: timestamp || new Date().toISOString(),
    };

    messages.push(msg);
    if (messages.length > 100) messages.shift();

    // Everyone in the room, including sender, sees the message
    io.emit('message', msg);
  });

  /* ---- private message ---- */
  socket.on('send_private_message', ({ content, recipientId, timestamp }) => {
    const msg = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      recipientId,
      content,
      type: 'private',
      timestamp: timestamp || new Date().toISOString(),
    };

    socket.to(recipientId).emit('private_message', msg);
    socket.emit('private_message', msg); // echo to sender
  });

  /* ---- typing indicator ---- */
  socket.on('typing_start', ({ room = 'general' }) => {
    if (users[socket.id]) {
      typingUsers[socket.id] = users[socket.id].username;
      socket.to(room).emit('user_typing', {
        userId: socket.id,
        username: typingUsers[socket.id],
      });
    }
  });

  socket.on('typing_stop', ({ room = 'general' }) => {
    if (typingUsers[socket.id]) {
      delete typingUsers[socket.id];
      socket.to(room).emit('user_typing', {
        userId: socket.id,
        username: null,
      });
    }
  });

  /* ---- disconnect ---- */
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username } = users[socket.id];
      console.log('❌ disconnect:', username);
      socket.broadcast.emit('user_left', { id: socket.id, username });
      delete users[socket.id];
      delete typingUsers[socket.id];
      io.emit('users_list', Object.values(users));
    }
  });
});

/* ---------- simple REST helpers ---------- */
app.get('/api/messages', (req, res) => res.json(messages));
app.get('/api/users',    (req, res) => res.json(Object.values(users)));
app.get('/', (req, res) => res.send('Socket.io Chat Server is running'));

/* ---------- boot ---------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server on :${PORT}`));

module.exports = { app, server, io };
