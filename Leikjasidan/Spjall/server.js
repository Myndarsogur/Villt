const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

mongoose.connect('mongodb+srv://myndarsogur:KSNzT5466142ZLg9@koster.ow6d1.mongodb.net/chat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const MessageSchema = new mongoose.Schema({
    user: String,
    text: String,
    timestamp: String,
});
const Message = mongoose.model('Message', MessageSchema);

app.use(express.static('public'));

// WebSocket tengingar
io.on('connection', (socket) => {
    console.log('User connected');

    // Senda eldri skilaboð
    Message.find().then((messages) => {
        socket.emit('chat history', messages);
    });

    // Taka á móti nýjum skilaboðum
    socket.on('send message', (data) => {
        const message = new Message(data);
        message.save().then(() => {
            io.emit('new message', data);
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
