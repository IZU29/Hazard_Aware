const mongoose = require('mongoose');

const surveillanceEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ['ALARM', 'WARNING', 'UNAUTHORIZED_RFID', 'HAZARD_ALERT'],
      default: 'HAZARD_ALERT',
    },
    hazardLabel: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true, // Cloudinary HTTPS link
    },
    cloudinaryPublicId: {
      type: String,
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SurveillanceEvent', surveillanceEventSchema);