const User = require('../Models/User')
const twilio = require('twilio')
const crypto = require('crypto')

//Generating otp
function generateAlphanumericOTP(length = 6) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const buffer = crypto.randomBytes(length);
    const otp = Array.from(buffer).map(byte => chars[byte % chars.length]).join('');
    return otp;
}
//const otp = generateAlphanumericOTP()
//console.log("Your OTP is: " + otp)

//for numericOTP
// function generateNumericOTP(length = 6) {
//     const buffer = crypto.randomBytes(length);
//     const otp = Array.from(buffer).map(byte =>byte % 10).join('');
//     return otp;
// }
// const otp = generateNumericOTP();
// console.log("Your OTP is: " + otp);

//Sending the Otp
const acctSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
    
    const client = new twilio(acctSid, authToken)
    
const sendOtp = async(req, res)=>{
    const {phonenumber}= req.body
    if(!phonenumber){
        res.status(400).json("Phone number is required")
    }
    const otp = generateAlphanumericOTP();
    const messageBody = `Please use this OTP: ${otp} to verify your account`
    try {
      await client.messages.create({
            body: messageBody,
            to:phonenumber,
            from:process.env.TWILIO_PHONE_NUMBER
        })
        .then((message)=>console.log(`OTP sent successfully! Message SID: ${message.sid}`))
        
    } catch (error) {
        return res.status(500).json( error.message)
    }
}

module.exports = {
    sendOtp
}