// models/ActivityTracker.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const SystemSchema = new Schema({
  platform: { type: String, required: true },
  processor: { type: String, required: true },
  cpu_cores: { type: Number, required: true },
  hostname: { type: String, required: true },
});

const MouseClickDataSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  button: { type: String, required: true },
});

const PerformanceSchema = new Schema({
  cpu_percent: { type: Number, required: true },
  memory_percent: { type: Number, required: true },
  memory_available: { type: Number, required: true },
  disk_percent: { type: Number, required: true },
  disk_free: { type: Number, required: true },
});

const NetworkSchema = new Schema({
  bytes_sent: { type: Number, required: true },
  bytes_recv: { type: Number, required: true },
  packets_sent: { type: Number, required: true },
  packets_recv: { type: Number, required: true },
});

const RunningAppSchema = new Schema({
  pid: { type: Number, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  cpu_percent: { type: Number, required: true },
  memory_percent: { type: Number, required: true },
});

const ProcessesSchema = new Schema({
  total: { type: Number, required: true },
  running_apps: [RunningAppSchema],
});

const PowerSchema = new Schema({
  battery_percent: { type: Number, required: true },
  power_plugged: { type: Boolean, required: true },
  battery_time_left: { type: Number, required: true },
});

const InputActivitySchema = new Schema({
  active_window: { type: String, required: false },
  last_key: { type: String, required: false, default: null },
  key_counts: { type: Map, of: Number },
  mouse_clicks: {
    left: { type: Number, required: true },
    right: { type: Number, required: true },
    middle: { type: Number, required: true },
  },
  mouse_position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  last_mouse_click: {
    timestamp: { type: Date, required: false, default: null },
    position: {
      x: { type: Number, required: false },
      y: { type: Number, required: false },
    },
    button: { type: String, required: false },
  },
});

const SessionInfoSchema = new Schema({
  idle_time: { type: Number, required: true },
  is_idle: { type: Boolean, required: true },
  session_duration: { type: Number, required: true },
});

// New schema for time tracking
const TimeTrackingSchema = new Schema({
  startTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // duration in seconds
  isActive: { type: Boolean, required: true },
  lastActiveTime: { type: Date },
  activeWindowDuration: { type: Map, of: Number }, // Store duration per window
});

const ActivityTrackerSchema = new Schema(
  {
    timestamp: { type: Date, required: true },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "entertainment",
        "social_media",
        "coding",
        "productivity",
        "gaming",
        "other",
      ],
      index: true,
    },
    system: { type: SystemSchema, required: true },
    performance: { type: PerformanceSchema, required: true },
    network: { type: NetworkSchema, required: true },
    processes: { type: ProcessesSchema, required: true },
    power: { type: PowerSchema, required: true },
    input_activity: { type: InputActivitySchema, required: true },
    session_info: { type: SessionInfoSchema, required: true },
    timeTracking: { type: TimeTrackingSchema, required: true },

    // Additional fields for analytics
    productivityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    applicationName: {
      type: String,
      index: true,
    },
    focusTime: {
      type: Number,
      default: 0, // Time spent focused in seconds
    },
    distractionCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // Add indexes for common queries
    indexes: [
      { timestamp: 1 },
      { category: 1, timestamp: 1 },
      { userId: 1, timestamp: 1 },
      { "timeTracking.startTime": 1 },
      { productivityScore: 1 },
    ],
  }
);

// Add method to calculate productivity score
ActivityTrackerSchema.methods.calculateProductivityScore = function () {
  const productiveCategories = ["coding", "productivity"];
  const semiProductiveCategories = ["entertainment"];

  let score = 0;

  // Base score from category
  if (productiveCategories.includes(this.category)) {
    score += 70;
  } else if (semiProductiveCategories.includes(this.category)) {
    score += 30;
  }

  // Adjust based on focus time
  if (this.focusTime > 45 * 60) {
    // More than 45 minutes
    score += 20;
  } else if (this.focusTime > 25 * 60) {
    // More than 25 minutes
    score += 10;
  }

  // Penalize for distractions
  score -= Math.min(20, this.distractionCount * 2);

  // Ensure score stays within bounds
  return Math.max(0, Math.min(100, score));
};

// Middleware to calculate productivity score before saving
ActivityTrackerSchema.pre("save", function (next) {
  if (
    this.isModified("focusTime") ||
    this.isModified("distractionCount") ||
    this.isModified("category")
  ) {
    this.productivityScore = this.calculateProductivityScore();
  }
  next();
});

// Add virtual for formatted duration
ActivityTrackerSchema.virtual("formattedDuration").get(function () {
  const duration = this.timeTracking.duration;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  return {
    hours,
    minutes,
    seconds,
    formatted: `${hours}h ${minutes}m ${seconds}s`,
  };
});

module.exports = mongoose.model("ActivityTracker", ActivityTrackerSchema);
