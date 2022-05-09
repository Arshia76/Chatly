const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/auth', require('./routes/auth'));

// const io = socketio(server, {
//   cors: {
//     origin: '*',
//   },
// });

// io.on('connection', (socket) => {
//   console.log(`scoket ${socket.id} is connected`);

//   socket.join('1');
//   //     socket.on('joinRoom',(room) => {
//   //         socket.join(room)
//   //         console.log(`joined room  ${room}`);
//   //     })

//   //    socket.on('sendMessage',(data,room) =>{
//   //     io.in(room).emit('recieveMessage',data)
//   //     console.log(data);
//   //     console.log(room);
//   //    })

//   socket.on('getUser', (id) => {
//     socket.join(id);
//     console.log(`joined room  ${id} `);
//   });

//   socket.on('privateMessage', (message, user) => {
//     io.in(user).emit('recieveMessage', message);
//     console.log(message);
//     user;
//   });

//   socket.on('disconnect', () => {
//     console.log(`socket ${socket} disconnected`);
//   });
// });

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`server started on port ${PORT}`));
