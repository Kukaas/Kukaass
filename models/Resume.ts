import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
    label: string;
    filename: string;
    originalFilename?: string;
    content: string; // Base64 string
    contentType: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
    {
        label: {
            type: String,
            required: [true, 'Please provide a label for this resume version'],
            trim: true,
        },
        filename: {
            type: String,
            required: [true, 'Please provide a filename for download'],
            trim: true,
        },
        originalFilename: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Please provide the resume content (Base64)'],
        },
        contentType: {
            type: String,
            required: [true, 'Please provide the content type (e.g., application/pdf)'],
            default: 'application/pdf',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to ensure only one resume is active if this one is set to active
ResumeSchema.pre('save', async function () {
    if (this.isActive) {
        await mongoose.model('Resume').updateMany(
            { _id: { $ne: this._id } },
            { $set: { isActive: false } }
        );
    }
});

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
