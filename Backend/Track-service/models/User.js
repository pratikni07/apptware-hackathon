const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    token: {
      type: String,
      required: false,
    },
    activityTracker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActivityTracker",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ userId: 1 });

module.exports = mongoose.model("User", userSchema);
