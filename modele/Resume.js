import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  resumeUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
