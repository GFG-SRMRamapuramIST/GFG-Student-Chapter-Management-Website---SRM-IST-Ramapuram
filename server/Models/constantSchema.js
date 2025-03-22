const mongoose = require("mongoose");

const constantSchema = new mongoose.Schema({
  achievementScheduler: {
    type: Boolean,
    default: true,
  },
  backupDataScheduler: {
    type: Boolean,
    default: true,
  },
  resetDataScheduler: {
    type: Boolean,
    default: true,
  },
  autoKickScheduler: {
    type: Boolean,
    default: false,
  },
  passingPercentage: {
    type: Number,
    required: true,
    default: 30,
  },
  perDayPracticePoint: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
    max: 6,
  },
  perContestPoint: {
    type: Number,
    required: true,
    default: 0,
  },
});

const ConstantValue = mongoose.model("ConstantValue", constantSchema);

module.exports = ConstantValue;
