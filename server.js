const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const upload = require('express-fileupload');
const connectDB = require('./config/db');
const path = require('path');
const axios = require('axios');
const app = express();
const server = http.createServer(app);

connectDB();

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(upload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '4mb' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/message', require('./routes/message'));
app.use('/api/user', require('./routes/user'));
app.use('/api', require('./routes/file'));

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
  // app.use(express.static(path.join(path.resolve(), '/frontend/build')));
  // app.get('*', (req, res) => {
  //   res.sendFile(
  //     path.resolve(path.resolve(), 'frontend', 'build', 'index.html')
  //   );
  // });
} else {
  app.get('/', (req, res) => {
    res.send('Api is running');
  });
}

const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('Connected to socket.io');
  socket.on('setup', (userData) => {
    socket.join(userData.id);
    if (!onlineUsers.some((data) => data.id === userData.id)) {
      onlineUsers.push({ id: userData.id, socket: socket.id });
    }

    io.emit('onlineUsers', onlineUsers);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
  });
  socket.on('typing', (room) => socket.in(room).emit('در حال تایپ...'));
  socket.on('stop typing', (room) => socket.in(room).emit('تایپ متوقف شد...'));

  socket.on('new message', ({ message, token }) => {
    var chat = message.chat;

    if (!chat.users) return console.log('chat.users not defined');

    if (true) {
      axios
        .put('/api/chat/increase/UnreadMessages', JSON.stringify(message), {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        })
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    }

    chat.users.forEach((user) => {
      io.in(user._id).emit('message recieved', message);
    });
  });

  socket.on('callUser', ({ userToCall, signalData, from, name }) => {
    console.log('called');
    console.log({ userToCall, from, name });
    io.to(userToCall).emit('callUser', { signal: signalData, from, name });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED');
    onlineUsers = onlineUsers.filter((data) => data.socket !== socket.id);

    console.log(onlineUsers);
    io.emit('offlineUsers', onlineUsers);
    // socket.leave(userId);

    // io.to(roomId).emit('userLeft', `${username} مکالمه را ترک کرد`);
  });
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`server started on port ${PORT}`));
