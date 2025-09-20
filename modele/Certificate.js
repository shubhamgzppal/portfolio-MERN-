import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  icon: { type: String },
  url: { type: String, required: true },
  date: { type: String, required: true },
  skills: [{ type: String }],
  category: { type: String, enum: ['FULL_STACK', 'DATA_SCIENCE'], default: 'FULL_STACK' },
}, { timestamps: true });

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
