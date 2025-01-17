const express = require("express");

const app = express();

const activityRoutes = require("./routes/activity.routes");

const database = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
database.connect();

app.use(express.json());
app.use(cookieParser());

// const whitelist = process.env.CORS_ORIGIN
//   ? JSON.parse(process.env.CORS_ORIGIN)
//   : ["*"];

app.use(cors());

app.use("/activity", activityRoutes);

const { setupDailyReports } = require("./services/activityReportService");
setupDailyReports();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
