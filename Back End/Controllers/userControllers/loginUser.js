const bcrypt = require("bcrypt");
const generateToken = require("../../Utils/generateToken");
const UserModel = require("../../Models/UserSchema");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // Find the user by email
        const user = await UserModel.findOne({ email: email }).select("+password");

        // If user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Ensure that the user has a password field before comparing
        if (!user.password) {
            return res.status(400).json({ success: false, message: "User password is not set" });
        }

        // Compare the password with the hashed password
        const matchedPassword = await bcrypt.compare(password, user.password);

        // If password doesn't match, return an error
        if (!matchedPassword) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        // Generate token and send response if the password matches
        return generateToken(user, 200, res, "User logged in successfully");
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

module.exports = { loginUser };
