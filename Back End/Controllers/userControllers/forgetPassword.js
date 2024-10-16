const UserModel = require("../../Models/UserSchema");
const sendEmail = require("../../Utils/email");
const generateOtp = require("../../Utils/generateOtp");

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Generate OTP
        const otp = generateOtp();
        user.resetpasswordOtp = otp;
        user.resetpasswordOtpExpires = Date.now() + 600000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        try {
            // Send OTP to the user's email
            await sendEmail({
                email: user.email,
                subject: "Reset Password",
                html: `<h1>Reset Password</h1> <p>Use this OTP to reset your password: ${otp}</p>`
            });

            return res.status(200).json({
                success: true,
                message: "Reset Password OTP sent to your email"
            });

        } catch (error) {
            // Clear OTP fields if sending the email fails
            user.resetpasswordOtp = undefined;
            user.resetpasswordOtpExpires = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: "Error sending email",
                error: error.message
            });
        }
    } catch (error) {
        // General error handling
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing the request",
            error: error.message
        });
    }
};

module.exports = forgetPassword;
