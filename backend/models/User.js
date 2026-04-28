const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    skills: {
        type: String,
        required: [true, 'Please add skills'],
        trim: true,
    },
    predictedJob: {
        type: String,
        required: true,
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false // allow anonymous access securely natively
    },
    source: {
        type: String,
        enum: ['manual', 'resume'],
        default: 'manual'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
