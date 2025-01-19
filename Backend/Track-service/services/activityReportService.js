// services/activityReportService.js
const cron = require("node-cron");
const mailSender = require("../utils/mailSender");
const ActivityTracker = require("../models/ActivityTracker");
const User = require("../models/User");

// Helper function to format duration
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
};

// Generate HTML email template
const generateDailyReportTemplate = (data) => {
  const {
    userName,
    date,
    totalActiveTime,
    categoryBreakdown,
    productivityMetrics,
    topApplications,
    systemMetrics,
  } = data;

  return `
  <!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
    .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    .metric { margin: 10px 0; }
    .highlight { color: #007bff; font-weight: bold; }
    .progress-bar { 
      background-color: #e9ecef;
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
    }
    .progress { 
      background-color: #007bff;
      height: 100%;
    }
    .platform-header {
      background-color: #f1f3f5;
      padding: 8px;
      border-radius: 4px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Daily Activity Report</h2>
      <p>For Darpan Neve - January 19, 2025</p>
    </div>

    <div class="section">
      <h3>📊 Daily Overview</h3>
      <div class="metric">
        <strong>Total Active Time:</strong> 5h 38m
      </div>
      <div class="metric">
        <strong>Platform Usage:</strong>
        <ul>
          <li>Windows: 3h 10m</li>
          <li>Linux: 2h 28m</li>
          <li>MacOS: 0h 0m</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <h3>💻 Top Applications by Platform</h3>
      
      <div class="platform-header">
        <strong>Linux Applications</strong>
      </div>
      <div class="metric">
        <strong>flutter_activity – activity_tracker.py:</strong> 2h 13m 10s (35.77%)
      </div>
      <div class="metric">
        <strong>Flutter package - Chrome:</strong> 26m 31s (7.12%)
      </div>

      <div class="platform-header">
        <strong>Windows Applications</strong>
      </div>
      <div class="metric">
        <strong>apptware – activity_controller.dart:</strong> 2h 30m 17s (40.36%)
      </div>
      <div class="metric">
        <strong>flutter_activity:</strong> 35m 19s (9.49%)
      </div>
      <div class="metric">
        <strong>VS Code - activity.controller.js:</strong> 11m 43s (3.15%)
      </div>
    </div>

    <div class="section">
      <h3>🎯 Category Breakdown</h3>
      <div class="metric">
        <strong>Coding:</strong> 2h 24m 53s (Linux: 2h 13m 10s, Windows: 11m 43s)
      </div>
      <div class="metric">
        <strong>Other:</strong> 3h 13m 56s
      </div>
      <div class="metric">
        <strong>Browser:</strong> 26m 31s
      </div>
      <div class="metric">
        <strong>Utilities:</strong> 2m 46s
      </div>
    </div>

    <div class="section">
      <h3>🖥️ Productivity Analysis</h3>
      <div class="metric">
        <strong>Most Used Platform:</strong> Windows (3h 10m)
      </div>
      <div class="metric">
        <strong>Most Productive Platform:</strong> Linux (Coding: 2h 13m 10s)
      </div>
      <div class="metric">
        <strong>Top Application:</strong> apptware – activity_controller.dart (2h 30m 17s)
      </div>
    </div>
  </div>
</body>
</html>
`;

  // return `
  //   <!DOCTYPE html>
  //   <html>
  //   <head>
  //     <style>
  //       body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  //       .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  //       .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
  //       .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
  //       .metric { margin: 10px 0; }
  //       .highlight { color: #007bff; font-weight: bold; }
  //       .progress-bar {
  //         background-color: #e9ecef;
  //         height: 20px;
  //         border-radius: 10px;
  //         overflow: hidden;
  //       }
  //       .progress {
  //         background-color: #007bff;
  //         height: 100%;
  //       }
  //     </style>
  //   </head>
  //   <body>
  //     <div class="container">
  //       <div class="header">
  //         <h2>Daily Activity Report</h2>
  //         <p>For ${userName} - ${date}</p>
  //       </div>

  //       <div class="section">
  //         <h3>📊 Daily Overview</h3>
  //         <div class="metric">
  //           <strong>Total Active Time:</strong> ${totalActiveTime}
  //         </div>
  //       </div>

  //       <div class="section">
  //         <h3>🎯 Productivity Metrics</h3>
  //         <div class="metric">
  //           <strong>Productivity Score:</strong> ${
  //             productivityMetrics.productivityPercentage
  //           }%
  //           <div class="progress-bar">
  //             <div class="progress" style="width: ${
  //               productivityMetrics.productivityPercentage
  //             }%"></div>
  //           </div>
  //         </div>
  //         <div class="metric">
  //           <strong>Most Productive Hour:</strong> ${
  //             productivityMetrics.mostProductiveHour
  //           }:00
  //         </div>
  //         <div class="metric">
  //           <strong>Focus Time:</strong> ${productivityMetrics.focusTime}
  //         </div>
  //       </div>

  //       <div class="section">
  //         <h3>📱 Category Breakdown</h3>
  //         ${categoryBreakdown
  //           .map(
  //             (category) => `
  //           <div class="metric">
  //             <strong>${category.name}:</strong> ${category.duration} (${category.percentage}%)
  //           </div>
  //         `
  //           )
  //           .join("")}
  //       </div>

  //       <div class="section">
  //         <h3>💻 Top Applications</h3>
  //         ${topApplications
  //           .map(
  //             (app) => `
  //           <div class="metric">
  //             <strong>${app.name}:</strong> ${app.duration}
  //           </div>
  //         `
  //           )
  //           .join("")}
  //       </div>

  //       <div class="section">
  //         <h3>🖥️ System Statistics</h3>
  //         <div class="metric">
  //           <strong>Average CPU Usage:</strong> ${systemMetrics.avgCpu}%
  //         </div>
  //         <div class="metric">
  //           <strong>Average Memory Usage:</strong> ${systemMetrics.avgMemory}%
  //         </div>
  //       </div>
  //     </div>
  //   </body>
  //   </html>
  // `;
};

// Function to generate daily report data
const generateDailyReport = async (userId) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const activities = await ActivityTracker.find({
    userId,
    timestamp: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  const user = await User.findOne({ userId });

  // Calculate metrics
  let totalDuration = 0;
  const categoryTimes = {};
  const applicationTimes = {};
  let totalCpu = 0;
  let totalMemory = 0;
  let productiveTime = 0;
  let hourlyActivity = new Array(24).fill(0);

  activities.forEach((activity) => {
    const duration = activity.session_info.session_duration;
    totalDuration += duration;

    // Category breakdown
    categoryTimes[activity.category] =
      (categoryTimes[activity.category] || 0) + duration;

    // Application tracking
    const appName = activity.input_activity.active_window;
    if (appName) {
      applicationTimes[appName] = (applicationTimes[appName] || 0) + duration;
    }

    // System metrics
    totalCpu += activity.performance.cpu_percent;
    totalMemory += activity.performance.memory_percent;

    // Productivity tracking
    if (["coding", "productivity"].includes(activity.category)) {
      productiveTime += duration;
    }

    // Hourly breakdown
    const hour = new Date(activity.timestamp).getHours();
    hourlyActivity[hour] += duration;
  });

  // Format the data for the email template
  const reportData = {
    userName: user.name,
    date: startOfDay.toLocaleDateString(),
    totalActiveTime: formatDuration(totalDuration),
    categoryBreakdown: Object.entries(categoryTimes).map(
      ([name, duration]) => ({
        name,
        duration: formatDuration(duration),
        percentage: ((duration / totalDuration) * 100).toFixed(1),
      })
    ),
    productivityMetrics: {
      productivityPercentage: ((productiveTime / totalDuration) * 100).toFixed(
        1
      ),
      mostProductiveHour: hourlyActivity.indexOf(Math.max(...hourlyActivity)),
      focusTime: formatDuration(productiveTime),
    },
    topApplications: Object.entries(applicationTimes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, duration]) => ({
        name,
        duration: formatDuration(duration),
      })),
    systemMetrics: {
      avgCpu: (totalCpu / activities.length).toFixed(1),
      avgMemory: (totalMemory / activities.length).toFixed(1),
    },
  };

  return reportData;
};

// // Setup cron job for daily reports
// const setupDailyReports = () => {
//   // Run at 11 PM every day
//   cron.schedule("0 23 * * *", async () => {
//     try {
//       // Get all users
//       const users = await User.find({});

//       for (const user of users) {
//         const reportData = await generateDailyReport(user.userId);
//         const emailTemplate = generateDailyReportTemplate(reportData);

//         await mailSender(
//           user.email,
//           "Your Daily Activity Report",
//           emailTemplate
//         );

//         console.log(`Daily report sent to ${user.email}`);
//       }
//     } catch (error) {
//       console.error("Error sending daily reports:", error);
//     }
//   });
// };

// module.exports = {
//   setupDailyReports,
// };

const setupDailyReports = () => {
  // Run every minute for testing
  cron.schedule("0 23 * * *", async () => {
    try {
      console.log(
        "Running activity report cron job...",
        new Date().toISOString()
      );

      // Get all users
      const users = await User.find({});
      console.log(`Found ${users.length} users to process`);

      for (const user of users) {
        console.log(`Generating report for user: ${user.email}`);

        const reportData = await generateDailyReport(user.userId);
        const emailTemplate = generateDailyReportTemplate(reportData);

        // Send email
        const result = await mailSender(
          user.email,
          "Your Activity Report (Test)",
          emailTemplate
        );

        console.log(`Test report sent to ${user.email}`, result);
      }
    } catch (error) {
      console.error("Error sending test reports:", error);
    }
  });

  console.log("Activity report cron job scheduled to run every minute");
};

module.exports = {
  setupDailyReports,
};
