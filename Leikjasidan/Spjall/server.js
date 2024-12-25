const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');

// Environment Variables (make sure these are set on Render or in your local .env file)
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb+srv://myndarsogur:KSNzT5466142ZLg9@koster.ow6d1.mongodb.net/?retryWrites=true&w=majority&appName=Koster";

// App and Server setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Change this to your GitHub Pages URL if needed
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' folder

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));


// Message Schema and Model
const MessageSchema = new mongoose.Schema({
    user: String,
    text: String,
    emoji: String,
    timestamp: String,
});
const Message = mongoose.model('Message', MessageSchema);

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send chat history to the connected user
    Message.find().then(messages => {
        socket.emit('chat history', messages);
    });

    // Handle receiving a new message
    socket.on('send message', (data) => {
        const message = new Message(data);
        message.save().then(() => {
            io.emit('new message', data); // Broadcast the new message to all connected clients
        });
    });

    // Handle user typing
    socket.on('user typing', (username) => {
        socket.broadcast.emit('user typing', username);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Serve fallback for React/Angular Single-Page Apps (optional)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
