// Import dependencies
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: "https://villt.is", // Uppruni lénsins
      methods: ["GET", "POST"],   // Aðferðir sem leyfðar eru
  }
});


// MongoDB connection using MongoClient

const uri = "mongodb+srv://myndarsogur:KSNzT5466142ZLg9@koster.ow6d1.mongodb.net/chat?retryWrites=true&w=majority&appName=Koster";

//if using mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



// Define message schema
const MessageSchema = new mongoose.Schema({
    user: String,
    text: String,
    emoji: String,
    timestamp: String,
});
const Message = mongoose.model('Message', MessageSchema);

// Serve static files
app.use(express.static('public'));

// WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send chat history
    Message.find().then(messages => {
        socket.emit('chat history', messages);
    });

    // Handle new messages
    socket.on('send message', (data) => {
        const message = new Message(data);
        message.save().then(() => {
            io.emit('new message', data);
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});