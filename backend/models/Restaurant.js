const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
});

const restaurantSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  cuisine: [{ type: String }],
  location: {
    type: pointSchema,
    required: true
  },
  address: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// 2dsphere index for geospatial queries
restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
