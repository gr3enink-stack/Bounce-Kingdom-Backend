import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['revenue', 'bookings', 'customer-satisfaction', 'equipment-utilization']
  },
  period: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  },
  date: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  metadata: {
    // Additional data specific to each report type
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient querying
reportSchema.index({ type: 1, period: 1, date: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;