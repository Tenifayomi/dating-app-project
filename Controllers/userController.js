const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const expressHandler=require('express-async-handler')

// Generating Token
const generateToken = (id)=>{
   return jwt.sign({userId: id}, process.env.JWT_SECRET, {expiresIn:'1d'})
}

// Registration
const registerUser =expressHandler(async(req, res)=>{
    const{email, phonenumber, password, firstname, lastname, age, gender, passions} = req.body
    try {
        if(!email || !phonenumber ||!password){
            return res.status(400).json("All fields must be filled")
        }
        if(password.length < 4){
            return res.status(400).json("Password cannot be less than 4 characters")
        }
// Hashing of password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password,salt)

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
            password:hashedPassword
        })

        const token = generateToken(createdUser._id)

        if(createdUser){
            const{email, phonenumber, password} = createdUser
            return res.status(200).json({email, phonenumber, password, age, firstname, lastname, passions, gender, token})
        }
    
    } catch (error) {
        return res.status(500).json(error.message)
    }

    }) 
//Choose preferences or criteria that determines matches
const preferences = expressHandler(async(req,res)=>{
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
        return res.status(404).json('An error ocurred')
    }
})

  
//Match based on preferences
const getMatched = expressHandler(async(req,res)=>{
    const{id}= req.params
    const {minAgePreference, maxAgePreference, genderPreference}= req.body
    try {
        const match = await User.findOne({id, minAgePreference, maxAgePreference, genderPreference})
        if(!match){
            return res.status(404).json('No matches Found')
        }else{
            return res.status(200).json(match)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

//update about
const updateAbout = expressHandler( async(req, res)=>{
 const {id} = req.params
 const {about} = req.body
 try {
    const updateAbout =await User.findByIdAndUpdate({_id:id},
        req.body,{
            about,
            runValidators:true,
            new:true
        }
    )
    if(updateAbout){
        return res.status(200).json(updateAbout)
    }else{
        return res.status(404).json('User not found')
    }
 } catch (error) {
    return res.status(500).json(error.message)
    
 }
})

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
            return res.status(400).json('Wrong email')
        }
        // check if password exists 
       const correctPwd = bcrypt.compareSync(password, userExists.password)
    
       if(userExists && correctPwd){
        const {_id, email} = userExists
        const Token = generateToken(_id)
        return res.status(200).json(_id, email, Token)
       }
    
    } catch (error) {
        return res.status(500).json(error.message)
    }
    })

//get single user
const singleUser = expressHandler(async(req, res)=>{
    const{id}=req.params

    try {
        const user = await User.fingById(id)
        if(!user){
            return res.status(404).json('User not found')
        }else{
            return res.status(200).json(user)
        }
    } catch (error) {
        return res.status(500).json(error.message)
        
    }
})

module.exports = {
    registerUser, logInUser, preferences, getMatched, singleUser, updateAbout
}