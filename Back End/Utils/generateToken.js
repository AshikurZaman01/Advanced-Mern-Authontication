const signToken = require("./signToken");
const jwt = require("jsonwebtoken");


const generateToken = (user, statusCode, res, message) => {
    const token = signToken(user._id, user.username, user.email);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // True only in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site, 'lax' for development
    };

    res.cookie("authToken", token, cookieOptions);

    user.password = undefined;
    user.otp = undefined;

    res.status(statusCode).json({
        success: "success",
        token,
        data: {
            user
        },
        message
    });
};


module.exports = generateToken;