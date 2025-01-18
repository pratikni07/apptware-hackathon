// api-gateway-service/index.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
// Add this before your routes

app.use(cors());
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  console.log("Body:", req.body);
  console.log("Headers:", req.headers);
  next();
});

app.use(express.urlencoded({ extended: true }));

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
  onProxyReq: (proxyReq, req, res) => {
    // Handle POST requests with body
    if (req.method === "POST" && req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader("Content-Type", "application/json");
      proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
      // Write body data to the proxy request
      proxyReq.write(bodyData);
    }

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
  onProxyReq: (proxyReq, req, res) => {
    if (req.method === "POST" && req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader("Content-Type", "application/json");
      proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Add this before your routes
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  console.log("Body:", req.body);
  console.log("Headers:", req.headers);
  next();
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