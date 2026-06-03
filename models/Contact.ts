import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name.'],
        maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    company: {
        type: String,
        maxlength: [120, 'Company cannot be more than 120 characters'],
        default: '',
    },
    email: {
        type: String,
        required: [true, 'Please provide your email.'],
        maxlength: [200, 'Email cannot be more than 200 characters'],
    },
    message: {
        type: String,
        required: [true, 'Please provide a message.'],
        maxlength: [5000, 'Message cannot be more than 5000 characters'],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

ContactSchema.set('toJSON', { virtuals: true });
ContactSchema.set('toObject', { virtuals: true });

// In development, handle hot-reloading by deleting the model from cache
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Contact;
}

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
