const mongoose = require("mongoose")


const TokenScheme = mongoose.Schema({
    token:{
        type:String,
    },
    user_id:{
        type:String,
    },
    createAt:{
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Toekns', TokenScheme)