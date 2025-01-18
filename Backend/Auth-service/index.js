// auth-service/index.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const database = require("./config/database");
const userRoutes = require("./routes/User");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database connection with error handling
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Enhanced CORS configuration
app.use(
  cors()
  // cors({
  //   origin: function (origin, callback) {
  //     const allowedOrigins = [
  //       "http://localhost:3000",
  //       "http://localhost:3001",
  //       "http://localhost:3002",
  //     ];
  //     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error("Not allowed by CORS"));
  //     }
  //   },
  //   credentials: true,
  //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
  // })
);

// Routes
app.use("/", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "auth-service",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
