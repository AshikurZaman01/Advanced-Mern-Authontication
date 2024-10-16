const UserModel = require("../../Models/UserSchema");
const sendEmail = require("../../Utils/email");
const generateOtp = require("../../Utils/generateOtp");
const bcrypt = require("bcrypt");
const generateToken = require("../../Utils/generateToken");

const signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all required fields." });
        }


        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 12);

        // Generate OTP and set expiration time
        const otp = generateOtp();
        const otpExpires = Date.now() + 50 * 60 * 1000; // 50 minutes from now

        // Create a new user
        const newUser = new UserModel({
            username,
            email,
            password: passwordHash,
            otp,
            otpExpires,
        });

        // Send OTP email
        try {
            await sendEmail({
                email: newUser.email,
                subject: "Verify your email",
                html: `<h1>Your OTP key is: ${otp}</h1><p>Please use this OTP to verify your email within 20 minutes.</p>`
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error sending email. Please try again later.",
                error: error.message
            });
        }

        // Save the new user to the database
        await newUser.save();

        // Generate JWT token and send response
        generateToken(newUser, 201, res, "User registered successfully. Please verify your email.");
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

module.exports = signupUser;
