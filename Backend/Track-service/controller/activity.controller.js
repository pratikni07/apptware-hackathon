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
    windowLower.includes("hotstar") ||
    windowLower.includes("hulu") ||
    windowLower.includes("disney+") ||
    windowLower.includes("spotify") ||
    windowLower.includes("vlc") ||
    windowLower.includes("media player") ||
    windowLower.includes("hbo") ||
    windowLower.includes("mx player") ||
    windowLower.includes("plex")
  ) {
    return "entertainment";
  }

  // Social media
  if (
    windowLower.includes("facebook") ||
    windowLower.includes("instagram") ||
    windowLower.includes("twitter") ||
    windowLower.includes("linkedin") ||
    windowLower.includes("discord") ||
    windowLower.includes("snapchat") ||
    windowLower.includes("reddit") ||
    windowLower.includes("pinterest") ||
    windowLower.includes("tiktok") ||
    windowLower.includes("threads") ||
    windowLower.includes("telegram") ||
    windowLower.includes("wechat")
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
    windowLower.includes("git") ||
    windowLower.includes("github") ||
    windowLower.includes("visual studio") ||
    windowLower.includes("pycharm") ||
    windowLower.includes("eclipse") ||
    windowLower.includes("xcode") ||
    windowLower.includes("postman") ||
    windowLower.includes("android studio") ||
    windowLower.includes("flutter_activity") ||
    windowLower.includes("kubernetes") ||
    windowLower.includes("docker")
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
    windowLower.includes("sheets") ||
    windowLower.includes("slides") ||
    windowLower.includes("onenote") ||
    windowLower.includes("todoist") ||
    windowLower.includes("evernote") ||
    windowLower.includes("monday.com") ||
    windowLower.includes("asana")
  ) {
    return "productivity";
  }

  // Browsers
  if (
    windowLower.includes("chrome") ||
    windowLower.includes("firefox") ||
    windowLower.includes("safari") ||
    windowLower.includes("edge") ||
    windowLower.includes("opera") ||
    windowLower.includes("brave") ||
    windowLower.includes("duckduckgo")
  ) {
    return "browser";
  }

  // Gaming
  if (
    windowLower.includes("steam") ||
    windowLower.includes("game") ||
    windowLower.includes("valorant") ||
    windowLower.includes("epic games") ||
    windowLower.includes("xbox") ||
    windowLower.includes("playstation") ||
    windowLower.includes("unity") ||
    windowLower.includes("unreal") ||
    windowLower.includes("blizzard") ||
    windowLower.includes("minecraft") ||
    windowLower.includes("fortnite")
  ) {
    return "gaming";
  }

  // Education
  if (
    windowLower.includes("coursera") ||
    windowLower.includes("udemy") ||
    windowLower.includes("khan academy") ||
    windowLower.includes("edx") ||
    windowLower.includes("byjus") ||
    windowLower.includes("unacademy") ||
    windowLower.includes("whitehat jr") ||
    windowLower.includes("chegg") ||
    windowLower.includes("duolingo") ||
    windowLower.includes("brilliant") ||
    windowLower.includes("quizlet")
  ) {
    return "education";
  }

  // Finance
  if (
    windowLower.includes("paypal") ||
    windowLower.includes("stripe") ||
    windowLower.includes("quickbooks") ||
    windowLower.includes("mint") ||
    windowLower.includes("venmo") ||
    windowLower.includes("cashapp") ||
    windowLower.includes("google pay") ||
    windowLower.includes("phonepe") ||
    windowLower.includes("zelle") ||
    windowLower.includes("finance") ||
    windowLower.includes("investment") ||
    windowLower.includes("stocks")
  ) {
    return "finance";
  }

  // Health/Fitness
  if (
    windowLower.includes("fitbit") ||
    windowLower.includes("myfitnesspal") ||
    windowLower.includes("healthifyme") ||
    windowLower.includes("strava") ||
    windowLower.includes("nike run club") ||
    windowLower.includes("garmin connect") ||
    windowLower.includes("google fit") ||
    windowLower.includes("apple health") ||
    windowLower.includes("calm") ||
    windowLower.includes("headspace")
  ) {
    return "health";
  }

  // Utilities
  if (
    windowLower.includes("calculator") ||
    windowLower.includes("settings") ||
    windowLower.includes("task manager") ||
    windowLower.includes("system info") ||
    windowLower.includes("notepad") ||
    windowLower.includes("wordpad") ||
    windowLower.includes("paint") ||
    windowLower.includes("control panel") ||
    windowLower.includes("file explorer") ||
    windowLower.includes("disk cleanup") ||
    windowLower.includes("defragment") ||
    windowLower.includes("device manager") ||
    windowLower.includes("cmd") ||
    windowLower.includes("powershell") ||
    windowLower.includes("terminal") ||
    windowLower.includes("resource monitor") ||
    windowLower.includes("event viewer") ||
    windowLower.includes("snipping tool") ||
    windowLower.includes("screen recorder") ||
    windowLower.includes("search") ||
    windowLower.includes("clock") ||
    windowLower.includes("alarms") ||
    windowLower.includes("voice recorder") ||
    windowLower.includes("magnifier") ||
    windowLower.includes("sticky notes") ||
    windowLower.includes("snip & sketch") ||
    windowLower.includes("print screen") ||
    windowLower.includes("print") ||
    windowLower.includes("printers") ||
    windowLower.includes("network") ||
    windowLower.includes("network connections") ||
    windowLower.includes("network settings") ||
    windowLower.includes("wi-fi") ||
    windowLower.includes("bluetooth") ||
    windowLower.includes("backup") ||
    windowLower.includes("restore") ||
    windowLower.includes("system restore") ||
    windowLower.includes("drive")
  ) {
    return "utilities";
  }

  // Communication
  if (
    windowLower.includes("whatsapp") ||
    windowLower.includes("zoom") ||
    windowLower.includes("skype") ||
    windowLower.includes("microsoft teams") ||
    windowLower.includes("google meet") ||
    windowLower.includes("webex") ||
    windowLower.includes("slack") ||
    windowLower.includes("signal") ||
    windowLower.includes("telegram")
  ) {
    return "communication";
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
            timestamp: activityData.timestamp,
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
    const { date , userId } = req.query;
    // const { userId } = req.body;


    console.log('abcd',new Date())
    // Get start and end of the specified date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    console.log(userId, startDate, endDate);
    const activities = await ActivityTracker.find({
      userId,
      // timestamp: {
      //   $gte: startDate,
      //   $lte: endDate,
      // },
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
      const { userId } = req.query;
  
      // Get today's date range
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0); // Start of the day
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999); // End of the day
  
      // Build the query object
      const query = {
        userId,
        // Uncomment this if you want to include timestamp filtering
        // timestamp: {
        //   $gte: startOfDay,
        //   $lte: endOfDay,
        // },
      };
  
      // Fetch activities matching the query
      const activities = await ActivityTracker.find(query);
  
      // Initialize usage trackers for each platform
      const platformUsage = {
        Linux: [],
        Windows: [],
        Mac: [],
      };
  
      // Process activities
      activities.forEach((activity) => {
        const platform = activity.system.platform;
        const category = activity.category;
        const duration = activity.timeTracking?.duration || 0;
  
        // Ensure the platform exists in platformUsage
        if (!platformUsage[platform]) {
          return; // Ignore unknown platforms
        }
  
        // Check if the category already exists in the platform array
        let categoryData = platformUsage[platform].find(
          (cat) => cat.category === category
        );
  
        if (!categoryData) {
          categoryData = {
            category,
            totalTime: 0,
            sessions: 0,
          };
          platformUsage[platform].push(categoryData);
        }
  
        // Update category data
        categoryData.totalTime += duration;
        categoryData.sessions++;
      });
  
      // Format the results by converting totalTime to formatted string
      const formatPlatformData = (platformData) =>
        platformData.map((data) => ({
          category: data.category,
          totalTime: formatDuration(data.totalTime),
          sessions: data.sessions,
        }));
  
      res.status(200).json({
        success: true,
        data: {
          Linux: formatPlatformData(platformUsage.Linux),
          Windows: formatPlatformData(platformUsage.Windows),
          Mac: formatPlatformData(platformUsage.Mac),
        },
        timeRange: {
          start: startOfDay.toISOString(),
          end: endOfDay.toISOString(),
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
