const express = require('express')
const router = express.Router()
const {authenticateToken} = require ('../middleware/authenticate')

const {registerUser, logInUser, preferences, getMatched, singleUser, updateUserDetails, deleteUser, changePassword, forgotPwd, resetPassword} = require('../Controllers/userController')
const { sendOtp } = require('../Controllers/otpController')


router.post('/register', registerUser)
router.post('/send-otp', sendOtp)
router.post('/login', logInUser)
router.put('/forgotpwd', forgotPwd)
router.post('/reset-pwd/:token', resetPassword)

// protect middleware
router.put('/preference/:id', authenticateToken, preferences)
router.get('/match/:id',authenticateToken, getMatched)
router.get('/getone/:id', authenticateToken, singleUser)
router.put('/about/:id', authenticateToken, updateUserDetails)
router.delete('/delete/:id', authenticateToken, deleteUser)
router.post('/change-password', authenticateToken, changePassword)
// const {protectedRoutes} = require('../middleware/authenticate)

module.exports = router 