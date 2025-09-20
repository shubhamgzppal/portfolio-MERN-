// models/Profile.js
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  description: { type: String, required: true },
  detailedDescription: { type: [String], required: true },
  quote: { type: String, required: true },
  skills: { type: [String], required: true },
  imgUrl: { type: String , required: true },
}, {
  timestamps: true,
});

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema);
