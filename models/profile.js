const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);  // Simple validation for a 10-digit phone number
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    avatar: {
        type: String,  // URL or file path to the avatar image
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
