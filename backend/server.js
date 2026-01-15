const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const { connectDB } = require("./src/config/connectDB");
const { sequelize } = require("./src/models/index");
const authRoutes = require("./src/routes/auth");
const courseRoutes = require("./src/routes/course");
const reviewRoutes = require("./src/routes/review");
const { Message } = require("./src/models/index");

const chatRoutes = require("./src/routes/chat");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", chatRoutes);
app.get("/", (req, res) => {
  res.send("F-Code Server Started");
});

// Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", async (data) => {
    console.log("Receive message:", data);

    try {
      await Message.create({
        sender_id: data.user_id,
        receiver_id: 1,
        content: data.message,
        is_read: true,
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }

    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("Created tables successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
