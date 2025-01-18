// routes/activityRoutes.js

const express = require("express");
const router = express.Router();
const activityController = require("../controller/activity.controller");
const authMiddleware = require("../middlewares/authMiddleware");

// Protect all routes
router.use(authMiddleware);

// Record new activity
router.post("/record", activityController.recordActivity);

// Get activity history with filters
router.get("/history", activityController.getActivityHistory);

// Get activity statistics
router.get("/stats", activityController.getActivityStats);

// Get detailed time analytics
router.get("/time-analytics", activityController.getTimeAnalytics);

router.get("/daily", activityController.getDailyAnalytics);
router.get("/getwindow", activityController.getWindowAnalytics);
router.get("/category", activityController.getCategoryAnalytics);

module.exports = router;
