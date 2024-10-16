const logoutUser = async (req, res) => {
    try {
        res.cookie("authToken", "", {
            maxAge: 1000, // 1 second
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure flag only in production
            sameSite: "none", // Adjust as needed (strict, lax, or none)
        });

        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = logoutUser;
