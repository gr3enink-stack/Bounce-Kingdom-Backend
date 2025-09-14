import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
activitySchema.index({ timestamp: -1 });
activitySchema.index({ user: 1, timestamp: -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;