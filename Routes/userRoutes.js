const express = require('express')
const router = express.Router()

const {registerUser, logInUser, preferences, getMatched, singleUser, updateUserDetails, deleteUser, resetPassword} = require('../Controllers/userController')
const { sendOtp } = require('../Controllers/otpController')


router.post('/register', registerUser)
router.post('/send-otp', sendOtp)
router.post('/login', logInUser)
router.put('/preference/:id', preferences)
router.get('/match/:id', getMatched)
router.get('/getone/:id', singleUser)
router.put('/about/:id', updateUserDetails)
router.delete('/delete/:id', deleteUser)
router.post('/reset-password', resetPassword)

// protect middleware


module.exports = router 