const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Proxy middleware configuration
const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SVC,
  changeOrigin: true,
  pathRewrite: {
    "^/api/auth": "",
  },
});

const trackProxy = createProxyMiddleware({
  target: process.env.TRACK_SVC,
  changeOrigin: true,
  pathRewrite: {
    "^/api/tracks": "",
  },
});

// Routes
app.use("/api/auth", authProxy);
app.use("/api/tracks", trackProxy);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
