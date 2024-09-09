const mongoose = require('mongoose')


const passionEnum = ['Photography', 'Shopping', 'Karaoke', 'Yoga','Cooking', 'Tennis', 'Run', 'Swimming', 
    'Art', 'Traveling', 'Extreme', 'Music', 'Drink', 'Video Games']

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true
    },
    phonenumber:{
        type:Number,
        required:[true, "Phone number cannot be less than 11 characters"],
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
      enum:['Male', 'Female']
    },
    genderPreference:{
        type:String,
        enum: ['Male', 'Female'],
    },
    passions:{
        type:[{
            type:String,
            enum:passionEnum
        }],
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
