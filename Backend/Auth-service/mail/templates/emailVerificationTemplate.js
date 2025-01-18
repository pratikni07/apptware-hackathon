const activityTrackerEmail = (activitySummary) => {
  return `<!DOCTYPE html>
	<html>
	
	<head>
	  <meta charset="UTF-8">
	  <title>Activity Tracker Notification</title>
	  <style>
		body {
		  background-color: #ffffff;
		  font-family: Arial, sans-serif;
		  font-size: 16px;
		  line-height: 1.4;
		  color: #333333;
		  margin: 0;
		  padding: 0;
		}
	
		.container {
		  max-width: 600px;
		  margin: 0 auto;
		  padding: 20px;
		  text-align: center;
		}
	
		.logo {
		  max-width: 200px;
		  margin-bottom: 20px;
		}
	
		.message {
		  font-size: 18px;
		  font-weight: bold;
		  margin-bottom: 20px;
		}
	
		.body {
		  font-size: 16px;
		  margin-bottom: 20px;
		  text-align: left;
		}
	
		.cta {
		  display: inline-block;
		  padding: 10px 20px;
		  background-color: #4CAF50;
		  color: #ffffff;
		  text-decoration: none;
		  border-radius: 5px;
		  font-size: 16px;
		  font-weight: bold;
		  margin-top: 20px;
		}
	
		.support {
		  font-size: 14px;
		  color: #999999;
		  margin-top: 20px;
		}
	
		.highlight {
		  font-weight: bold;
		}
	  </style>
	
	</head>
	
	<body>
	  <div class="container">
		<a href="https://activitytracker-app.vercel.app"><img class="logo"
			src="https://i.ibb.co/7Xyj3PC/logo.png" alt="Activity Tracker Logo"></a>
		<div class="message">Your Activity Summary</div>
		<div class="body">
		  <p>Dear User,</p>
		  <p>Here is your activity update for the day:</p>
		  <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin: 10px 0;">
			${activitySummary}
		  </div>
		  <p>Stay consistent with your activities and achieve your goals faster. Check out your detailed activity insights on our platform.</p>
		  <a href="https://activitytracker-app.vercel.app" class="cta">View My Activity</a>
		</div>
		<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
			href="mailto:support@activitytracker.com">support@activitytracker.com</a>. We’re here to help!</div>
	  </div>
	</body>
	
	</html>`;
};
module.exports = activityTrackerEmail;
