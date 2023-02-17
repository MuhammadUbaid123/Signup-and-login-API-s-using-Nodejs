const jwt = require("jsonwebtoken")
const {response} = require("../utils/response")
const User = require("../models/User");
const Tokens = require("../models/Tokens");

const auth = async (req, res, next) =>{
    const authHeader = req.headers.authorization;


    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        return response(res, 401, "error", "Sorry! Invalid Authentication!", null)
    }

    const token = authHeader.split(' ')[1];
    
    try {

        /* Check if the token exist or not */
        const token_exist = await Tokens.findOne({token:token});
        if(!token_exist){   /* If not exist */
            return response(res, 401, "error", "Sorry! Un-authenticated request!", null);
        }
        next()
    } catch (error) {
        return response(res, 401, "error", "Not authorized to access this route", null);
    }

}


module.exports = auth