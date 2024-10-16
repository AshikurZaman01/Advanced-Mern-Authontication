const { default: mongoose } = require("mongoose");
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter your username"],
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxLength: [20, "Username can't exceed 20 characters"],
        index: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [5, "Password must be at least 5 characters"],
        select: false,
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    resetpasswordOtp: {
        type: String,
        default: null
    },
    resetpasswordOtpExpires: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
