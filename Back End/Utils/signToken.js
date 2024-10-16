const jwt = require("jsonwebtoken");


const signToken = (id, username, email) => {
    return jwt.sign(
        { id, username, email },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};
module.exports = signToken;