const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./src/config/connectDB");
const { sequelize } = require("./src/models/index");
const authRoutes = require("./src/routes/auth");
const courseRoutes = require("./src/routes/course");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.get("/", (req, res) => {
  res.send("F-Code Server Started");
});

const PORT = process.env.PORT || 8080;

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
