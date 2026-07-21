// models/Device.js
const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceName: {
    type: String,
    required: true
  },
  macAddress: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  // Specific physical location details for signal tracking
  location: {
    building: { type: String, required: true }, // e.g., "Factory Floor 1"
    section: { type: String, required: true },  // e.g., "Boiler Room Zone B"
    coordinates: { type: String }                // Optional GPS/Grid location
  },
  // The Admin gatekeeper flag
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' // Must be explicitly approved by an admin
  },
  apiKeyHash: {
    type: String,
    default: null // Generated ONLY when approved
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'disabled'],
    default: 'offline'
  }
}, { timestamps: true });

module.exports = mongoose.model('Device', DeviceSchema);