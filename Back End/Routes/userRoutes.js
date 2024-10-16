const express = require('express');
const signupUser = require('../Controllers/userControllers/signupUser');
const userVerifyOTP = require('../Controllers/userControllers/userVerifyOTP');
const isAuthenticated = require('../Middlewear/userMiddlewear/isAuthenticated');
const resentOTP = require('../Controllers/userControllers/resendOTP');
const { loginUser } = require('../Controllers/userControllers/loginUser');
const logoutUser = require('../Controllers/userControllers/logoutUser');
const forgetPassword = require('../Controllers/userControllers/forgetPassword');
const resetPassword = require('../Controllers/userControllers/resetPassword');
const router = express.Router();

// ------------------------------------------------------------------
router.post('/signup', signupUser);
// ------------------------------------------------------------------

// ******************************************************************
router.post('/verifyOTP', isAuthenticated, userVerifyOTP);

router.post('/resendOTP', isAuthenticated, resentOTP);
// *******************************************************************

// ------------------------------------------------------------------
router.post('/login', loginUser);
// ------------------------------------------------------------------

// *******************************************************************
router.post('/logout', isAuthenticated, logoutUser);
// ------------------------------------------------------------------

router.post('/forgetPassword', forgetPassword);

router.post('/resetPassword', resetPassword);

module.exports = router;