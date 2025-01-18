// controllers/activityController.js

const ActivityTracker = require("../models/ActivityTracker");
const User = require("../models/User");

const determineCategory = (activeWindow) => {
  const windowLower = activeWindow.toLowerCase();

  // Video/streaming apps
  if (
    windowLower.includes("netflix") ||
    windowLower.includes("youtube") ||
    windowLower.includes("prime") ||
    windowLower.includes("vlc") ||
    windowLower.includes("media player")
  ) {
    return "entertainment";
  }

  // Social media
  if (
    windowLower.includes("facebook") ||
    windowLower.includes("instagram") ||
    windowLower.includes("twitter") ||
    windowLower.includes("linkedin") ||
    windowLower.includes("discord")
  ) {
    return "social_media";
  }

  // Development/work
  if (
    windowLower.includes("code") ||
    windowLower.includes("studio") ||
    windowLower.includes("intellij") ||
    windowLower.includes("sublime") ||
    windowLower.includes("terminal") ||
    windowLower.includes("git")
  ) {
    return "coding";
  }

  // Productivity
  if (
    windowLower.includes("word") ||
    windowLower.includes("excel") ||
    windowLower.includes("powerpoint") ||
    windowLower.includes("notion") ||
    windowLower.includes("docs") ||
    windowLower.includes("sheets")
  ) {
    return "productivity";
  }

  // Gaming
  if (
    windowLower.includes("steam") ||
    windowLower.includes("game") ||
    windowLower.includes("unity") ||
    windowLower.includes("unreal")
  ) {
    return "gaming";
  }

  return "other";
};

// Helper function to format time duration
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return {
    hours,
    minutes,
    seconds: remainingSeconds,
    formatted: `${hours}h ${minutes}m ${remainingSeconds}s`,
  };
};

const activityController = {
  // Record new activity
  recordActivity: async (req, res) => {
    try {
        const userId = req.user.id;
        const activityData = req.body;

        
        activityData.userId = userId;
        activityData.category = determineCategory(
            activityData.input_activity?.active_window || "Unknown"
        );

        // Add time tracking data with default values
        activityData.timeTracking = {
            startTime: new Date(),
            duration: activityData.session_info?.session_duration || 0,
            isActive: activityData.session_info?.is_idle === false,
            lastActiveTime: new Date(),
            activeWindowDuration: {},
        };

        // Ensure required fields have fallback defaults
        
        const formattedActivityData = {
            timestamp: new Date(),
            system: {
                platform: activityData.system?.platform || "Unknown",
                hostname: activityData.system?.hostname || "Unknown",
            },
            performance: {
                cpu_percent: activityData.performance?.cpu_percent ?? 0,
                memory_percent: activityData.performance?.memory_percent ?? 0,
                disk_percent: activityData.performance?.disk_percent ?? 0,
            },
            power: {
                battery_percent: activityData.power?.battery_percent ?? 0,
                power_plugged: activityData.power?.power_plugged ?? false,
                battery_time_left: activityData.power?.battery_time_left ?? 0,
            },
            input_activity: {
                active_window: activityData.input_activity?.active_window || "Unknown",
            },
            session_info: {
                idle_time: activityData.session_info?.idle_time ?? 0,
                is_idle: activityData.session_info?.is_idle ?? true,
                session_duration: activityData.session_info?.session_duration ?? 0,
            },
            timeTracking: activityData.timeTracking,
            userId: activityData.userId,
            category: activityData.category,
        };

        // Create and save the activity
        const activity = new ActivityTracker(formattedActivityData);
        await activity.save();

        // Update the user's activity tracker reference
        await User.findOneAndUpdate(
            { userId },
            { activityTracker: activity._id },
            { new: true }
        );

        res.status(201).json({
            success: true,
            data: activity,
            category: activity.category,
        });
    } catch (error) {
        console.error("Error in recordActivity:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.stack,
        });
    }
},

  getTimeAnalytics: async (req, res) => {
    try {
        const { startDate, endDate, groupBy = "day" } = req.query;
        const userId = req.user.id;

        const query = {
            userId: userId,
        };

        if (startDate && endDate) {
            query.timestamp = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const activities = await ActivityTracker.find(query);

        // Initialize time tracking objects
        const timeByCategory = {};
        const timeByDay = {};
        const timeByHour = {};

        activities.forEach((activity) => {
            const date = activity.timestamp.toISOString().split("T")[0];
            const hour = activity.timestamp.getHours();
            const duration = activity.session_info.session_duration; // Using session_info for duration
            const category = activity.category;

            // Track time by category
            timeByCategory[category] = (timeByCategory[category] || 0) + duration;

            // Track time by day
            timeByDay[date] = (timeByDay[date] || 0) + duration;

            // Track time by hour
            timeByHour[hour] = (timeByHour[hour] || 0) + duration;
        });

        // Format the results
        const formattedResults = {
            userId: userId, // Include userId in response
            byCategory: Object.entries(timeByCategory).map(
                ([category, duration]) => ({
                    category,
                    ...formatDuration(duration),
                    rawDuration: duration,
                })
            ),
            byDay: Object.entries(timeByDay).map(([date, duration]) => ({
                date,
                ...formatDuration(duration),
                rawDuration: duration,
            })),
            byHour: Object.entries(timeByHour).map(([hour, duration]) => ({
                hour: parseInt(hour),
                ...formatDuration(duration),
                rawDuration: duration,
            })),
            total: formatDuration(
                Object.values(timeByCategory).reduce((a, b) => a + b, 0)
            ),
        };

        // Calculate productivity metrics
        const productiveCategories = ["coding", "productivity"];
        const productiveTime = productiveCategories.reduce(
            (total, category) => total + (timeByCategory[category] || 0),
            0
        );
        const totalTime = Object.values(timeByCategory).reduce(
            (a, b) => a + b,
            0
        );

        formattedResults.productivityMetrics = {
            productiveTime: formatDuration(productiveTime),
            productivityPercentage: totalTime
                ? ((productiveTime / totalTime) * 100).toFixed(2)
                : 0,
            mostProductiveDay: formattedResults.byDay.reduce((a, b) =>
                a.rawDuration > b.rawDuration ? a : b
            ).date,
            mostProductiveHour: formattedResults.byHour.reduce((a, b) =>
                a.rawDuration > b.rawDuration ? a : b
            ).hour,
        };

        res.status(200).json({
            success: true,
            data: formattedResults,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
},
getDailyAnalytics: async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.id;
    console.log(userId, date);

    // Get start and end of the specified date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const activities = await ActivityTracker.find({
      userId,
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // Initialize analytics objects
    const hourlyBreakdown = Array(24)
      .fill(0)
      .map(() => ({
        total: 0,
        byCategory: {},
      }));

    const categoryBreakdown = {
      total: 0,
      categories: {},
      activeWindows: {},
    };

    // Process activities
    activities.forEach((activity) => {
      const hour = activity.timestamp.getHours();
      const duration = activity.session_info.session_duration;
      const category = activity.category;
      const activeWindow = activity.input_activity.active_window;

      // Update hourly breakdown
      hourlyBreakdown[hour].total += duration;
      hourlyBreakdown[hour].byCategory[category] =
        (hourlyBreakdown[hour].byCategory[category] || 0) + duration;

      // Update category breakdown
      categoryBreakdown.total += duration;
      categoryBreakdown.categories[category] =
        (categoryBreakdown.categories[category] || 0) + duration;

      // Track time per active window
      if (activeWindow) {
        categoryBreakdown.activeWindows[activeWindow] =
          (categoryBreakdown.activeWindows[activeWindow] || 0) + duration;
      }
    });

    // Format durations and calculate percentages
    const formattedHourlyBreakdown = hourlyBreakdown.map((hour, index) => ({
      hour: index,
      total: formatDuration(hour.total),
      byCategory: Object.entries(hour.byCategory).map(([cat, dur]) => ({
        category: cat,
        duration: formatDuration(dur),
        percentage: ((dur / hour.total) * 100).toFixed(2),
      })),
    }));

    const formattedCategoryBreakdown = {
      total: formatDuration(categoryBreakdown.total),
      categories: Object.entries(categoryBreakdown.categories).map(
        ([cat, dur]) => ({
          category: cat,
          duration: formatDuration(dur),
          percentage: ((dur / categoryBreakdown.total) * 100).toFixed(2),
        })
      ),
      activeWindows: Object.entries(categoryBreakdown.activeWindows)
        .map(([window, dur]) => ({
          window,
          duration: formatDuration(dur),
          percentage: ((dur / categoryBreakdown.total) * 100).toFixed(2),
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10), // Top 10 active windows
    };

    // Calculate productivity metrics
    const productiveCategories = ["coding", "productivity"];
    const productiveTime = productiveCategories.reduce((total, category) => {
      return total + (categoryBreakdown.categories[category] || 0);
    }, 0);

    const productivityMetrics = {
      productiveTime: formatDuration(productiveTime),
      productivityPercentage: (
        (productiveTime / categoryBreakdown.total) *
        100
      ).toFixed(2),
      mostProductiveHour: formattedHourlyBreakdown.sort(
        (a, b) => b.total.rawDuration - a.total.rawDuration
      )[0]?.hour,
      mostUsedCategory: formattedCategoryBreakdown.categories.sort(
        (a, b) => b.percentage - a.percentage
      )[0],
    };

    // Get activity patterns
    const activityPatterns = {
      morningActivity: calculatePeriodActivity(hourlyBreakdown, 5, 11),
      afternoonActivity: calculatePeriodActivity(hourlyBreakdown, 12, 17),
      eveningActivity: calculatePeriodActivity(hourlyBreakdown, 18, 23),
    };

    res.status(200).json({
      success: true,
      data: {
        date,
        userId,
        hourlyBreakdown: formattedHourlyBreakdown,
        categoryBreakdown: formattedCategoryBreakdown,
        productivityMetrics,
        activityPatterns,
        summary: {
          totalActiveTime: formatDuration(categoryBreakdown.total),
          totalCategories: Object.keys(categoryBreakdown.categories).length,
          uniqueApplications: Object.keys(categoryBreakdown.activeWindows)
            .length,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
},

getWindowAnalytics: async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.id;

    console.log('date', date);
    console.log('userId', userId);

    // Get start and end of the specified date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const activities = await ActivityTracker.find({
      userId,
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // Initialize window tracking object
    const windowUsage = {};
    let totalTime = 0;

    // Process activities to accumulate time per window
    activities.forEach((activity) => {
      const activeWindow = activity.input_activity.active_window;
      const duration = activity.session_info.session_duration;
      const system = activity.system.platform;
      if (activeWindow) {
        windowUsage[activeWindow] = windowUsage[activeWindow] || {
          totalDuration: 0,
          category: activity.category,
          lastActive: activity.timestamp,
          system: system,
        };
        windowUsage[activeWindow].totalDuration += duration;
        totalTime += duration;
      }
    });

    // Format the window usage data
    const formattedWindowUsage = Object.entries(windowUsage)
  .map(([window, data]) => ({
    window,
    category: data.category,
    duration: formatDuration(data.totalDuration),
    percentage: ((data.totalDuration / totalTime) * 100).toFixed(2),
    lastActive: data.lastActive,
    system: data.system, // Include system information
  }))
  .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

// Create separate arrays for Linux, Windows, and MacOS
const linuxWindows = formattedWindowUsage.filter(item => item.system === 'Linux');
const windowsWindows = formattedWindowUsage.filter(item => item.system === 'Windows');
const macOsWindows = formattedWindowUsage.filter(item => item.system === 'MacOS');

console.log('Linux:', linuxWindows);
console.log('Windows:', windowsWindows);
console.log('MacOS:', macOsWindows);


    res.status(200).json({
      success: true,
      data: {
        date,
        userId,
        windowUsage: formattedWindowUsage,
        linuxWindows: linuxWindows,
        windowsWindows: windowsWindows,
        macOsWindows: macOsWindows,
        summary: {
          totalActiveTime: formatDuration(totalTime),
          totalWindows: formattedWindowUsage.length,
          mostUsedWindow: formattedWindowUsage[0],
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
},
  // New method to get detailed category analytics
  getCategoryAnalytics: async (req, res) => {
    try {
      const { category, startDate, endDate } = req.query;
      const userId = req.user.id;

      const query = {
        userId,
        category,
      };

      if (startDate && endDate) {
        query.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const activities = await ActivityTracker.find(query);

      // Initialize analytics objects
      const applicationUsage = {};
      const dailyUsage = {};
      const productivityMetrics = {
        totalTime: 0,
        averageProductivityScore: 0,
        focusedSessions: 0,
        distractions: 0,
      };

      // Process activities
      activities.forEach((activity) => {
        const date = activity.timestamp.toISOString().split("T")[0];
        const duration = activity.timeTracking?.duration || 0;
        const activeWindow = activity.input_activity?.active_window || "Unknown";

        // Track application usage
        if (activeWindow) {
          applicationUsage[activeWindow] = applicationUsage[activeWindow] || {
            totalTime: 0,
            sessions: 0,
            averageProductivityScore: 0,
          };
          applicationUsage[activeWindow].totalTime += duration;
          applicationUsage[activeWindow].sessions++;
          applicationUsage[activeWindow].averageProductivityScore +=
            activity.productivityScore || 0;
        }

        // Track daily usage
        dailyUsage[date] = (dailyUsage[date] || 0) + duration;

        // Update productivity metrics
        productivityMetrics.totalTime += duration;
        productivityMetrics.averageProductivityScore +=
          activity.productivityScore || 0;
        if (activity.focusTime > 25 * 60) {
          // Sessions over 25 minutes
          productivityMetrics.focusedSessions++;
        }
        productivityMetrics.distractions += activity.distractionCount || 0;
      });

      // Format the results
      const formattedApplicationUsage = Object.entries(applicationUsage)
        .map(([app, metrics]) => ({
          application: app,
          totalTime: formatDuration(metrics.totalTime),
          sessions: metrics.sessions,
          averageProductivityScore: (
            metrics.averageProductivityScore / metrics.sessions
          ).toFixed(2),
        }))
        .sort((a, b) => b.totalTime.rawDuration - a.totalTime.rawDuration);

      const formattedDailyUsage = Object.entries(dailyUsage)
        .map(([date, duration]) => ({
          date,
          duration: formatDuration(duration),
        }))
        .sort((a, b) => b.duration.rawDuration - a.duration.rawDuration);

      const activityCount = activities.length;
      productivityMetrics.averageProductivityScore =
        activityCount > 0
          ? (
              productivityMetrics.averageProductivityScore / activityCount
            ).toFixed(2)
          : 0;

      res.status(200).json({
        success: true,
        data: {
          category,
          userId,
          summary: {
            totalTime: formatDuration(productivityMetrics.totalTime),
            totalSessions: activityCount,
            uniqueApplications: Object.keys(applicationUsage).length,
          },
          applicationUsage: formattedApplicationUsage,
          dailyUsage: formattedDailyUsage,
          productivityMetrics,
          timeRange: {
            start: startDate,
            end: endDate,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // Get activity history with filters
  getActivityHistory: async (req, res) => {
    try {
      const { startDate, endDate, category, limit = 50, page = 1 } = req.query;

      const query = {};

      if (startDate && endDate) {
        query.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      if (category) {
        query.category = category;
      }

      console.log(query)
      const skip = (page - 1) * limit;

      const activities = await ActivityTracker.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

        console.log(activities);
      // Add formatted duration to each activity
      const activitiesWithFormattedTime = activities.map((activity) => ({
        ...activity
        // formattedDuration: formatDuration(activity.timeTracking?.duration || 0),
      }));

      const total = await ActivityTracker.countDocuments(query);

      res.status(200).json({
        success: true,
        data: activitiesWithFormattedTime,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },


  // Get activity statistics with time tracking
  getActivityStats: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.id;

      const query = {
        userId: userId,
      };

      if (startDate && endDate) {
        query.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const activities = await ActivityTracker.find(query);

      // Calculate statistics
      const stats = {
        categoryBreakdown: {},
        timeSpentByCategory: {},
        averageCpuUsage: 0,
        averageMemoryUsage: 0,
        totalActiveTime: 0,
        totalIdleTime: 0,
        dailyPatterns: {},
        mostProductiveHours: [],
        userId: userId, // Include userId in response
      };

      activities.forEach((activity) => {
        const hour = activity.timestamp.getHours();
        const date = activity.timestamp.toISOString().split("T")[0];

        // Category breakdown
        stats.categoryBreakdown[activity.category] =
          (stats.categoryBreakdown[activity.category] || 0) + 1;

        // Time spent by category
        stats.timeSpentByCategory[activity.category] =
          (stats.timeSpentByCategory[activity.category] || 0) +
          (activity.timeTracking?.duration || 0);

        // System usage
        stats.averageCpuUsage += activity.performance?.cpu_percent || 0;
        stats.averageMemoryUsage += activity.performance?.memory_percent || 0;

        // Time tracking
        if (!activity.session_info?.is_idle) {
          stats.totalActiveTime += activity.session_info?.session_duration || 0;

          // Track daily patterns
          stats.dailyPatterns[date] =
            (stats.dailyPatterns[date] || 0) +
            (activity.session_info?.session_duration || 0);
        } else {
          stats.totalIdleTime += activity.session_info?.idle_time || 0;
        }
      });

      const count = activities.length;
      if (count > 0) {
        stats.averageCpuUsage /= count;
        stats.averageMemoryUsage /= count;
      }

      // Format time durations
      Object.keys(stats.timeSpentByCategory).forEach((category) => {
        stats.timeSpentByCategory[category] = formatDuration(
          stats.timeSpentByCategory[category]
        );
      });

      stats.totalActiveTime = formatDuration(stats.totalActiveTime);
      stats.totalIdleTime = formatDuration(stats.totalIdleTime);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

};

function calculatePeriodActivity(hourlyBreakdown, startHour, endHour) {
  let totalDuration = 0;
  let activeHours = 0;
  let peakHour = {
    hour: startHour,
    duration: 0,
  };

  for (let hour = startHour; hour <= endHour; hour++) {
    const hourData = hourlyBreakdown[hour];
    totalDuration += hourData.total;

    if (hourData.total > 0) {
      activeHours++;
    }

    if (hourData.total > peakHour.duration) {
      peakHour = {
        hour,
        duration: hourData.total,
      };
    }
  }
  const periodLength = endHour - startHour + 1;

  return {
    totalDuration: formatDuration(totalDuration),
    activeHours,
    activityPercentage: ((activeHours / periodLength) * 100).toFixed(2),
    averageDuration: formatDuration(totalDuration / periodLength),
    peakHour: {
      hour: peakHour.hour,
      duration: formatDuration(peakHour.duration),
    },
  };
}

// function formatDuration(seconds) {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const remainingSeconds = Math.floor(seconds % 60);

//   return {
//     hours,
//     minutes,
//     seconds: remainingSeconds,
//     formatted: `${hours}h ${minutes}m ${remainingSeconds}s`,
//     rawDuration: seconds,
//   };
// }

module.exports = activityController;
