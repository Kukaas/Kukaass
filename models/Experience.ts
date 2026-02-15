import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide a company name.'],
        maxlength: [100, 'Company name cannot be more than 100 characters'],
    },
    role: {
        type: String,
        required: [true, 'Please provide a role title.'],
        maxlength: [100, 'Role title cannot be more than 100 characters'],
    },
    description: {
        type: [String],
        default: [],
    },
    location: {
        type: String,
        maxlength: [100, 'Location cannot be more than 100 characters'],
    },
    mapUrl: {
        type: String,
        maxlength: [500, 'Map URL cannot be more than 500 characters'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide a start date.'],
    },
    endDate: {
        type: Date,
        default: null,
    },
    isCurrent: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Ensure virtual fields are included when converting to JSON
ExperienceSchema.set('toJSON', { virtuals: true });
ExperienceSchema.set('toObject', { virtuals: true });

// In development, handle hot-reloading by deleting the model from cache
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Experience;
}

export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
