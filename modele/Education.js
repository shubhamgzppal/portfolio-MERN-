import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  title: { type: String, required: true },    
  institute: { type: String, required: true }, 
  duration: { type: String, required: true },
  category: { type: String, required: true },
  certificateUrl: { type: String, required: false },
  focusAreas: [{ type: String }],         
  achievements: [{ type: String }],      
}, { timestamps: true });

const Education = mongoose.models.Education || mongoose.model('Education', EducationSchema);

export default Education;
