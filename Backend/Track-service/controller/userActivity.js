const ActivityTracker = require("../models/ActivityTracker");
const User = require("../models/User");

const UserActivityController={
    userData: async (req,res)=>{
        const {userId} = req.query;


          const user=await User.findById(userId);
          const countActivity= await ActivityTracker.find({userId: userId},
            {
                where: {
                    timestamp: {
                      $gte: new Date(new Date().setHours(0, 0, 0)),
                      $lt: new Date(new Date().setHours(23, 59, 59)),
                    },
                  },
            }   
          ).countDocuments();
          const activeHours=(countActivity*15)/3600;
          const minutes=((countActivity*15)%3600)/60;

          // const latestActivity = await ActivityTracker.findOne(
          //   {
          //     userId,
          //     timestamp: {
          //       $gte: new Date().setHours(0, 0, 0, 0), // Start of the day
          //       $lt: new Date(new Date().setHours(23, 59, 59, 999)), // End of the day
          //     },
          //   },
          //   null, // No specific fields to project
          //   {
          //     sort: { timestamp: -1 }, // Sort by timestamp descending to get the latest
          //   }
          // );
        


          return res.status(200).json({
            success: true,
            data: {
              user: user,
              activeHours: activeHours,
              minutes: minutes,
              // cpu: latestActivity.performance.cpu_percent,
              // memory: latestActivity.performance.memory_percent,
              // disk: latestActivity.performance.disk_percent,
            },
          });

    }
}

module.exports = UserActivityController;