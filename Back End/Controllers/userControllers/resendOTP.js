const UserModel = require("../../Models/UserSchema");
const sendEmail = require("../../Utils/email");
const generateOtp = require("../../Utils/generateOtp");

const resentOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ message: "Please provide an email." });
        }

        // Find the user by email
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified." });
        }

        // Generate new OTP and set expiration time
        const newOTP = generateOtp();
        user.otp = newOTP;
        user.otpExpires = Date.now() + 1 * 60 * 60 * 1000; // OTP expires in 1 hour

        // Save the updated user data
        await user.save({ validateBeforeSave: false });

        // Send the OTP via email
        await sendEmail({
            email: user.email,
            subject: "Verify your email",
            html: `<h1>Your OTP is ${newOTP}. Please enter this OTP to verify your email.</h1>`
        });

        // Respond with success message
        res.status(200).json({ success: true, message: "OTP sent successfully." });
    } catch (error) {
        // Handle any errors during the process
        console.error("Error in resending OTP:", error);

        // In case of email failure, clear the OTP and expiration to prevent confusion
        if (user) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save({ validateBeforeSave: false });
        }

        res.status(500).json({ message: "There was an error sending the email.", error: error.message });
    }
};

module.exports = resentOTP;
