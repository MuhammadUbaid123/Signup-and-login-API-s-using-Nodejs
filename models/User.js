const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const UserSchema = mongoose.Schema({
    fname:{
        type:String,
        required:[true, "First Name is Required!"],
        trim: true
    },
    lname:{
        type:String,
        required:[true, "Last Name is Required!"],
        trim: true
    },
    email:{
        type:String,
        required:[true, "Email is Required!"],
        match:[
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
            'Email is required'
        ],
        unique:true
    }, 
    password:{
        type:String,
        required:[true, "Password is required"]
    },
    image:{
        type:String,
    }
})

/* Bcrypt the password */
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})


/* Comparing the password when logging In */
UserSchema.methods.comparePassword = async function (userPassword){
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch
}

/* Create JWT  form authentication */
UserSchema.methods.createJWT = function (){
    return jwt.sign({id:this._id, fname:this.fname, email:this.email, "gender": "Male"}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME})
}

module.exports = mongoose.model('User', UserSchema)