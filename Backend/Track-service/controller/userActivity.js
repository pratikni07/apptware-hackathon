const ActivityTracker = require("../models/ActivityTracker");
const User = require("../models/User");

const UserActivityController={
    userData: async (req,res)=>{
        const userId = req.user.id;

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

          return res.status(200).json({
            success: true,
            data: {
              user: user,
              activeHours: activeHours,
              minutes: minutes,
            },
          });

    }
}

module.exports = UserActivityController;