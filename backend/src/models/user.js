const mongoose = require("mongoose")
const bcryptjs = require('bcrypt')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Automatically excludes password when querying users from the DB
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'developer'],
    default: 'user'
  },
  // Security & Account Management
  isVerified: {
    type: Boolean,
    default: false
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'pending'],
    default: 'active'
  },
  // // Sub-document array for tracking active refresh tokens/sessions across multiple browsers
  // activeSessions: [{
  //   tokenVersion: { type: Number, default: 0 },
  //   lastUsed: { type: Date, default: Date.now },
  //   userAgent: String
  // }]
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Pre-save middleware to automatically hash passwords before storing them
UserSchema.pre('save', async function () {
  // If the password hasn't changed, just return (no next() needed)
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcryptjs.genSalt(12);
    this.password = await bcryptjs.hash(this.password, salt);
    // No next() here! Mongoose automatically knows to proceed when the async function finishes.
  } catch (err) {
    // If an error happens, throw it so Mongoose catches it and bubbles it up to your route
    throw err; 
  }
});
module.exports  =  mongoose.models.User || mongoose.model('User', UserSchema);