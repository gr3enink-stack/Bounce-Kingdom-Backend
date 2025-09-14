import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    maxlength: 10000000 // Increase limit for base64 images (10MB)
  },
  specs: {
    dimensions: String,
    ageGroup: String,
    capacity: String
  },
  additionalSpecs: {
    type: String
  },
  category: {
    type: String,
    enum: ['Bounce House', 'Water Slide', 'Balloon Pit', 'Combo Unit', 'Obstacle Course'],
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'In Use', 'Maintenance'],
    default: 'Available'
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;