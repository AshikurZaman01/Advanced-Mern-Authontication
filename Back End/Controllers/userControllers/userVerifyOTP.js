const generateToken = require("../../Utils/generateToken");

const userVerifyOTP = async (req, res) => {

    try {

        const { otp } = req.body;

        if (!otp) {
            return res.status(400).send({ success: false, message: "OTP is required." })
        }

        const user = req.user;

        if (user.otp !== otp) {
            return res.status(400).send({ success: false, message: "OTP is incorrect." })
        }

        if (Date.now() > user.otpExpires) {
            return res.status(400).send({ success: false, message: "OTP is expired." })
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save({ validateBeforeSave: false });

        generateToken(user, 200, res, "User verified successfully.")

    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }

};
module.exports = userVerifyOTP;