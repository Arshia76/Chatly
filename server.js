const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const upload = require('express-fileupload');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
const server = http.createServer(app);

connectDB();

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(upload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '4M' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/message', require('./routes/message'));
app.use('/api/user', require('./routes/user'));
app.use('/api', require('./routes/file'));

const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');
  socket.on('setup', (userData) => {
    console.log(userData);
    socket.join(userData.id);
    console.log(socket.rooms);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(socket.rooms);
    console.log('User Joined Room: ' + room);
  });
  socket.on('typing', (room) => socket.in(room).emit('در حال تایپ...'));
  socket.on('stop typing', (room) => socket.in(room).emit('تایپ متوقف شد...'));

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log('chat.users not defined');

    // io.in(chat._id).emit('message recieved', newMessageRecieved);
    chat.users.forEach((user) => {
      // if (user._id == newMessageRecieved.sender._id) return;

      io.in(user._id).emit('message recieved', newMessageRecieved);
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

  socket.off('disconnect', (userId, username, roomId) => {
    console.log('USER DISCONNECTED');
    socket.leave(userId);
    io.to(roomId).emit('userLeft', `${username} مکالمه را ترک کرد`);
  });
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`server started on port ${PORT}`));
