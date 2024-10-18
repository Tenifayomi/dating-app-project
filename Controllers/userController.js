const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const expressHandler = require('express-async-handler')
const nodemailer = require('nodemailer')
const sendMail = require("../Utilities/email")


// Generating Token
const generateToken = (id)=>{
     // id, private key, (options)
   return jwt.sign({userId: id}, process.env.JWT_SECRET, {expiresIn:'1d'})
}

// Registration
const registerUser = expressHandler(async(req, res)=>{
    const{email, phonenumber, password, firstname, lastname, age, gender, passions,nickname,about} = req.body
    try {
        //Validation
        if(!email || !phonenumber ||!password){
            return res.status(400).json({message:"All fields must be filled"})
        }
        if(password.length < 4){
            return res.status(400).json({message:"Password cannot be less than 4 characters"})
        }
// Hashing of password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password,salt)

        // if(!nickname){
        //     return res.status(400).json("Unique Id is required")
       // }
        if(age<18){
            return res.status(400).json("You are too young to be in a relationship, face your book")
        }
        if(age>70){
            return res.status(400).json("You are too old, go and sleep...LOOOL")
        }
        if(passions < 2){
            return res.status(400).json("Please select at least two passions")
        }
        // if(about.length > 500){
        //     return res.status(400).json("Words Limit is 500")
        // }

        // If Email or phone number already exists
        const userExist = await User.findOne({email, phonenumber})
        if(userExist){
            return res.status(400).json("User already exists")
        }

        // Creating a User
        const createdUser = await User.create({
            email:email,
            phonenumber:phonenumber,
            password:hashedPassword,
            nickname:nickname
        })
        const subject = `Welcome to Our App!`
        const html = `
        <p>Hi ${nickname},</p>
        <p>Thank you for signing up to our app! We are excited to have you onboard.</p>
        <p>Best regards,<br>Sex and the City</p>`

        sendMail(createdUser.email,subject,html)

        const token = generateToken(createdUser._id)
        //  res.cookie("jwt", token, {
        //     path:'/',
        //     httpOnly: true,
        //     expires: new Date(Date.now() + 1000 * 24),
        //     sameSite: "none",
        //     secure:true
        //  })

        if(createdUser){
            const{email, phonenumber, password} = createdUser
            return res.status(201).json({email, phonenumber, password, age, firstname, lastname, passions, gender, token, nickname})
        }
    } catch (error) {
        return res.status(400).json(error.message)
    }
    });

//Choose preferences or criteria that determines matches
const preferences = expressHandler(async (req,res)=>{
    const{id}= req.params
    const{minAgePreference, maxAgePreference, genderPreference}=req.body

    const updateUser = await User.findByIdAndUpdate(
       {_id:id},
       req.body, {minAgePreference,
            maxAgePreference,
            genderPreference},

            {  runValidators:true,
                new:true}
    )
    if(updateUser){
        return res.status(200).json(updateUser)
    }else{
        return res.status(400).json('An error ocurred')
    }
})

  
//Match based on preferences
const getMatched = expressHandler(async(req,res)=>{
    const{id}= req.params

    try {
        //To fetch current user
        const currentUser = await User.findById(id)
        if(!currentUser){
            return res.status(404).json("User not found")
        }
        // find match based on the user's and other users' preference

        const match = await User.findOne({
            userId:{$ne: id}, 
            gender: currentUser.genderPreference, // Match the current user's gender preference
            genderPreference: currentUser.gender, // To ensure the other users' gender preference
            age:{
                $gte:currentUser.minAgePreference, // To match the current user's age preference within the age range
                $lte: currentUser.maxAgePreference
            },
            minAgePreference:{$lte: currentUser.age}, // To ensure the other users'prefer the current user's age preference
            maxAgePreference:{$gte: currentUser.age}
            })
        if(!match){
            return res.status(404).json('No matches Found')
        }else{
            return res.status(200).json(match)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
});
 
//update about
const updateUserDetails = expressHandler(async(req, res)=>{
 const {id} = req.params
 const {about,gender,passions, firstname, lastname, nickname} = req.body
 try {
    const updateAbout = await User.findByIdAndUpdate({_id:id},
        req.body,{
            about,
            gender,
            passions,
            firstname,
            lastname,
            nickname
        },
        {
            runValidators:true,
            new:true
        }
    )
    if(updateAbout){
        return res.status(200).json(updateAbout)
    }else{
        return res.status(400).json('An error ocurred')
    }
 } catch (error) {
    return res.status(500).json(error.message)
 }
});

// User Log In
const logInUser = expressHandler (async(req, res)=>{
    const {email,password}= req.body
    try {
        if(!email || !password){
            return res.status(400).json('Fields cannot be empty')
        }
    
        // check if email does not exist
        const userExists = await User.findOne({email})
        if(!userExists){
            return res.status(400).json({message: 'Wrong email'})
        }
        // check if password exists
       const correctPwd = bcrypt.compareSync(password, userExists.password)
       if(userExists && correctPwd){
        const {id, email, nickname} = userExists
        const Token = generateToken(id)
        // res.cookie('jwt', Token, {httpOnly: true, secure:true, expires: new Date(Date.now() + 1000 * 24)})
        return res.status(200).json ({id, email, Token, nickname})
       }else{
        return res.status(400).json({message: 'Password is incorrect'})
       }
    
    } catch (error) {
        return res.status(500).json(error.message)
    }
    })

//get single user
const singleUser = expressHandler(async(req, res)=>{
    const{id}=req.params
    try {
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json('User not found')
        }else{
            return res.status(200).json(user)
        }
    } catch (error) {
        return res.status(500).json(error.message)
        
    }
})

// change password
const changePassword = expressHandler(async (req, res)=>{
    const{id, currentPassword, newPassword}=req.body
    try {
        const userExist = await User.findById(id)
        if(!userExist){
            return res.status(404).json('User not found')
        }
        // Check if the current password matches the hashed password in the database
        const isMatch = await bcrypt.compare(currentPassword, userExist.password)
        if(!isMatch){
            return res.status(400).json({message:'Current Password is incorrect'})
        }
        //Hash new password
        const salt = bcrypt.genSaltSync(10)
        const hashNewPassword = bcrypt.hashSync(newPassword, salt)

        //update new password to database
        if(userExist.password = hashNewPassword){
            await userExist.save();
            return res.status(200).json({message:'Password updated successfully'})
        };
    } catch (error) {
        return res.status(500).json(error.message)
    }
}
)

//Forgot Password
const forgotPwd = expressHandler(async (req, res)=>{
    const{email}=req.body
try{ 
        const userExists = await User.findOne({email})
        if(!userExists){
            return res.status(400).json({message:'User not found'})
        }
        const token = generateToken(userExists._id);
        console.log(token);
        
        const Transporter= nodemailer.createTransport({
            service:'gmail', 
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            auth:{
            user:process.env.THE_EMAIL, //Sender gmail address
            pass:process.env.EMAIL_PASSWORD // App pwd from gmail
            } 
        });
            const receiver = {
                from:{
                    name: "Sex and the City",
                    address: process.env.THE_EMAIL
                },
              to: email,    // Recipient's email
              subject: "Forgot Password Request",    // Subject of the email
              text:`Click on this link to generate your new password ${process.env.CLIENT_URL}/reset-password ${token}`     // Plain text body
            };
                await Transporter.sendMail(receiver)
                return res.status (200).json({message:"Password reset link has been sent to your gmail account"})
                //console.log({message: 'Password reset link sent successfully. Please check gmail to reset your password'});
              } catch (error) {
                console.error('Error sending email:', error);
                throw error;  // You can handle the error in the controller
              }
            }
         )


// Reset password
const resetPassword = async (req, res) => {
  const {newPassword} = req.body;
  const {token} = req.params

  try {
    // Find the user by the reset token and ensure the token is still valid
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: {$gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    // Update the user's password
    const salt = bcrypt.genSaltSync(10)
    const hashedPwd = bcrypt.hashSync(newPassword,salt)
    user.password = hashedPwd; // Hash this password before saving (bcrypt)
   
    //clear the reset token and expiry time
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    //save the updated
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete account
const deleteUser = expressHandler( async(req, res)=>{
    const{id} = req.params
    try {
        const deletedUser = await User.findByIdAndDelete(id)
        if(!deletedUser){
            return res.status(404).json('User not found')
        }else{
            return res.status(200).json("Account deleted successfully")
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

module.exports = {
    registerUser, 
    logInUser,
     preferences,
      getMatched,
       singleUser,
        updateUserDetails, 
        deleteUser, 
        changePassword, 
        forgotPwd,
        resetPassword
}