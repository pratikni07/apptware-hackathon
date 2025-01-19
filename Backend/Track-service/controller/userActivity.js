const ActivityTracker = require("../models/ActivityTracker");
const User = require("../models/User");

const UserActivityController = {
  userData: async (req, res) => {
    try {
      const { userId } = req.query;

      // Fetch user information
      const user = await User.findById(userId);

      // Count today's activities
      const countActivity = await ActivityTracker.find(
        {
          userId: userId,
          timestamp: {
            $gte: new Date(new Date().setHours(0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59)),
          },
        }
      ).countDocuments();

      const activeHours = Math.floor((countActivity * 15) / 3600);
      const minutes = ((countActivity * 15) % 3600) / 60;

      // Retrieve the latest activity for each platform
      const platforms = ["Linux", "Windows", "Mac"];
      const platformMetrics = {};

      for (const platform of platforms) {
        const latestActivity = await ActivityTracker.findOne(
          {
            userId,
            "system.platform": platform,
            timestamp: {
              $gte: new Date(new Date().setHours(0, 0, 0)), // Start of the day
              $lt: new Date(new Date().setHours(23, 59, 59)), // End of the day
            },
          },
          null, // No specific fields to project
          { sort: { timestamp: -1 } } // Sort by timestamp descending to get the latest
        );

        if (latestActivity) {
          platformMetrics[platform] = {
            cpu: latestActivity.performance.cpu_percent,
            memory: latestActivity.performance.memory_percent,
            disk: latestActivity.performance.disk_percent,
          };
        } else {
          platformMetrics[platform] = {
            cpu: null,
            memory: null,
            disk: null,
          };
        }
      }

      // Return response
      return res.status(200).json({
        success: true,
        data: {
          user: user,
          activeHours: activeHours,
          minutes: minutes,
          platformMetrics: platformMetrics,
        },
      });
    } catch (error) {
      console.error("Error fetching user activity data:", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
};

module.exports = UserActivityController;
