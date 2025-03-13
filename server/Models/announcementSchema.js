const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  time: { type: String },
  links: [
    {
      linkText: { type: String },
      link: { type: String },
    },
  ],
});

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
