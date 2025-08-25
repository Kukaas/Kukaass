import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this project.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this project.'],
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  link: {
    type: String,
    required: [true, 'Please provide a link for this project.'],
  },
  githubLink: {
    type: String,
  },
  images: {
    type: [String], // Array of base64 strings
    default: [],
  },
  techStack: {
    type: [String],
    default: [],
  },
  features: {
    type: [String],
    default: [],
  },
  challenges: {
    type: [String],
    default: [],
  },
  solutions: {
    type: [String],
    default: [],
  },
  purpose: {
    type: [String],
    default: [],
  },
  duration: {
    type: String,
  },
  role: {
    type: String,
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
