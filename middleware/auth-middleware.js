const jwt = require("jsonwebtoken")
const {response} = require("../utils/response")
const User = require("../models/User")

const auth = async (req, res, next) =>{
    const authHeader = req.headers.authorization;


    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        return response(res, 401, "error", "Sorry! Invalid Authentication!", null)
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET)

       // const user = User.findOne(payload.id).select("-password")

        req.user = payload;//{id:user.id, fname:user.fname, email:user.email}
        next()
    } catch (error) {
        return response(res, 401, "error", "Not authorized to access this route", null);
    }

}


module.exports = auth