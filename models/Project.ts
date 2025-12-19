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
  isPrivate: {
    type: Boolean,
    default: false,
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
  startDate: {
    type: Date,
    // Temporarily make it optional for migration
    // required: [true, 'Please provide a start date for this project.'],
  },
  endDate: {
    type: Date,
  },
  isOngoing: {
    type: Boolean,
    default: false,
  },
  // Keep duration for backward compatibility
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual field for calculated duration
ProjectSchema.virtual('calculatedDuration').get(function() {
  if (!this.startDate) {
    // Fallback to existing duration field for backward compatibility
    return this.duration || 'Not specified';
  }

  if (this.isOngoing) {
    const start = new Date(this.startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      if (remainingMonths > 0) {
        return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
      }
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
  } else if (this.endDate) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      if (remainingMonths > 0) {
        return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
      }
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
  } else {
    // Has start date but no end date and not ongoing - show as "In Progress"
    return 'In Progress';
  }
});

// Ensure virtual fields are included when converting to JSON
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });

// Update the updatedAt field before saving
ProjectSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
