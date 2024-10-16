const jwt = require('jsonwebtoken');
const UserModel = require('../../Models/UserSchema');

const isAuthenticated = async (req, res, next) => {

    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized User.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded : ", decoded);

    const currentUser = await UserModel.findById(decoded.id);
    if (!currentUser) {
        return res.status(401).json({ message: 'Unauthorized User. ' });
    }

    req.user = currentUser;
    next();

};
module.exports = isAuthenticated;