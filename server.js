const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/group");
const http = require("http");
const socketIo = require("socket.io");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://your-react-app.onrender.com", // Production
];

// CORS for the Express API
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true, // Enable credentials for cookies if needed
  })
);

// Create the HTTP server
const server = http.createServer(app);

// Socket.IO CORS configuration
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins, // Use the array for allowed origins
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/groups", groupRoutes); // Add group routes

// Socket.io events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  // Handle group messages
  socket.on("sendGroupMessage", (message) => {
    io.to(message.groupId).emit("receiveGroupMessage", message);
  });

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start listening
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
