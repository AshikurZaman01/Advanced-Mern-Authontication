const UserModel = require("../../Models/UserSchema");
const bcrypt = require("bcrypt");
const generateToken = require("../../Utils/generateToken");

const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        // Check if all required fields are provided
        if (!email || !otp || !password) {
            return res.status(400).send({ message: 'Email, OTP, and new password are required' });
        }

        // Find the user based on email and OTP, and check if OTP is not expired
        const user = await UserModel.findOne({
            email,
            resetpasswordOtp: otp,
            resetpasswordOtpExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send({ message: 'User not found or OTP expired' });
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetpasswordOtp = undefined;
        user.resetpasswordOtpExpires = undefined;

        // Save the updated user data
        await user.save();

        // Generate a new token and respond with success
        generateToken(user, 200, res, "Password reset successfully");

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = resetPassword;
