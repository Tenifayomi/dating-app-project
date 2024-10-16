const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true
    },
    phonenumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:[true, "Password is required"],
        minlength:[4, "Password should be at least 4 characters"]
    },
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    nickname:{
        type:String,
       required:[true, "Nickname is required"]
    },
    age:{
        type:Number
    },
    minAgePreference:{
        type:Number
    }, 
  maxAgePreference: {
    type:Number
    },
    about: {
        type:String, 
        maxlength:[500, "Limit is 500 words"]
    },
    gender:{
      type:String,
     // enum:['Male', 'Female']
    },
    genderPreference:{
        type:String,
        enum: ['Male', 'Female'],
    },
    passions:{
       type:String,
       //enum:passionEnum

        // validate: {
        //     validator: function(value) {
        //         return value.length > 2; 
        //     },
        //     message: 'At least two passions must be selected.'
        // }
    },
    
}, {
    timestamps:true 
})

const User = mongoose.model('user', userSchema)

module.exports = User
