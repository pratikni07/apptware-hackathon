// api-gateway-service/index.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Enhanced error handling and logging for auth proxy
const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SVC,
  changeOrigin: true,
  secure: false, // Allow insecure connections for local development
  pathRewrite: {
    "^/api/auth": "", // Remove trailing slash to prevent double-slash
  },
  onError: (err, req, res) => {
    console.error(`Proxy Error (Auth Service): ${err.message}`);
    res.status(502).json({
      status: "error",
      message: "Authentication service unavailable",
      error: err.message,
    });
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(
      `[Auth Proxy] ${req.method} ${req.url} -> ${proxyRes.statusCode}`
    );
  },
  onProxyReq: (proxyReq, req, res) => {
    // Preserve original headers
    proxyReq.setHeader("x-forwarded-for", req.ip);
    console.log(`[Auth Request] ${req.method} ${req.url} -> ${proxyReq.path}`);
  },
});

// Enhanced track service proxy
const trackProxy = createProxyMiddleware({
  target: process.env.TRACK_SVC,
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    "^/api/tracks": "",
  },
  onError: (err, req, res) => {
    console.error(`Proxy Error (Track Service): ${err.message}`);
    res.status(502).json({
      status: "error",
      message: "Track service unavailable",
      error: err.message,
    });
  },
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Routes
app.use("/api/auth", authProxy);
app.use("/api/tracks", trackProxy);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
