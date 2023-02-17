const {response} = require("../utils/response")
const User = require("../models/User")
const Tokens = require("../models/Tokens")
const uploadFile = require("../utils/uploadFile")
const multer = require("multer")




/* Signup or registeration */
const signup = async (req, res) =>{
    const {fname, lname, email, password} = req.body;

    if(!fname || !email || !password || !lname){
        return response(res, 402, "error",  'Missing fields' , null)
    }

    const user_exist = await User.findOne({email:req.body.email})
    if(user_exist){
        return response(res, 402, "error",  "Email already exist" , null)
    }


    try{
        const user = await User.create({...req.body})
        return response(res, 201, "success",  'User Registered successfully' , {name:user.fname+" "+user.lname})
    }
    catch(error){
        return response(res, 402, error,  "Something went wrong" , null)
    }
}



/* Login API */
const login = async (req, res) =>{
    
    const {email, password} = req.body;
    if(!email || !password){
        return response(res, 402, "error",  "Email or password is empty" , null)
    }


    const user = await User.findOne({email:req.body.email});;

    if(!user){
        return response(res, 404, "error", "User Don't exist", null) 
    }

    const isPaswordCorrect = await user.comparePassword(password);

    if(!isPaswordCorrect){
        return response(res, 402, "error", "Sorry Invalid credentials!", null )
    }

    const token = user.createJWT();
    const token_saved = await Tokens.create({user_id:user._id, token:token})
    return response(res, 201, "success",  'Logged In successfully' , {name:user.fname+" "+user.lname, email, token})



    // try{

    //     const user_exist = await User.findOne({email:req.body.email});
    //     if(user_exist){
    //         const user = await User.findOne({email:email, password:password});
    //         if(user){
    //             console.log(user)
    //             const token = user.createJWT();
    //             const token_saved = await Tokens.create({user_id:user._id, token:token})
    //             return response(res, 201, "success",  'Logged In successfully' , {name:user.fname+" "+user.lname, email, token})
    //         }else{
    //             return response(res, 402, "error",  "Sorry Password is Incorrect" , null)
    //         }
    //     }else{
    //         return response(res, 402, "error",  "User Doesn't exist" , null)
    //     }
    // }catch(error)
    // {
    //     return response(res, 402, "error",  "Something went wrong" , null)
    // }
    

}

/* Get Details API */
const getDetails = async (req, res) =>{

    // console.log(req.user);

    const userData = await User.findOne({_id:req.user.id});
    if(!userData){
        return response(res, 404, "error", "User Doesn't exist !", null)
    }
    return response(res, 200, "success",  "User Data Fetched Successfully" , userData)
}


module.exports = {
    signup,
    login,
    getDetails
}