// models/Project.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tech: [String],
  image: String,
  link: String,
  github: String,
  category: { type: String, enum: ['FULL_STACK', 'DATA_SCIENCE'], default: 'FULL_STACK' }
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
