const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/auth-middleware")
const tokenExist = require("../middleware/tokenExist")
const multer = require("multer")
const {response} = require("../utils/response")
const User = require("../models/User")
const sharp = require('sharp')



/* Only resize image */
const resizeImage = async (img, newName, folderName, resX, resY) => {
    await sharp (img)
    .resize(resX, resY)
    .toFile(`./public/imagesContainer/${folderName}/${newName}.jpg`)
}
/* Make different sizes of image */
const compOverlay = async (overlayImage, resX, resY, BaseImage, fImageNamendExt, folderName) =>{
    const resizeImg = await sharp(BaseImage)
    .resize(resX, resY)
    .toBuffer();
    

    const photoWidth = 800;
    const finalImg = await sharp(resizeImg)
    .composite([{input: overlayImage, center:true, blend: 'over'}])
    .sharpen(14)
    .toFile(`./public/imagesContainer/${folderName}/${fImageNamendExt}.jpg`)
}

/* Multer image upload logic */
const Storage = multer.diskStorage({
    destination:"public/imagesContainer",
    filename: (req, file , cb)=>{
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage: Storage
})
/*______________________________*/

const {
    signup, login, getDetails
} = require('../controllers/user-controller')


router.route('/signup').post(signup)    /* Route for signup */

/* Route for updating profile picture */
router.route('/updateinfo').post(
    authMiddleware, 
    upload.single("testFile"), 
    async (req, res)=>{

        const {id, fname, email} = req.user;
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: id },
                { 
                    $set: { 
                        // image:{
                        // data: req.file.filename,
                        // contentType:"image/png"
                        // },
                        image: req.file.filename,
                        fname: req.body.fname,
                        lname:req.body.lname
                    } 
                },
                { new: true }
            );
            /* ------------------------------------------------------------------------ */
            /* [][][][][][][][][][-------   Image Rsizing   -------][][][][][][][][][] */
            /*__________________________________________________________________________*/
            resizeImage(`./public/imagesContainer/${updatedUser.image}`, `resize${updatedUser.id}Profile300x300`, "300x300", 300, 300); /* Resized 300x300 */
            resizeImage(`./public/imagesContainer/${updatedUser.image}`, `resize${updatedUser.id}Profile700x700`, "700x700", 700, 700); /* Resized 700x700 */
            cresizeImage(`./public/imagesContainer/${updatedUser.image}`, `resize${updatedUser.id}Profile1024x1024`, "1024x1024", 1024, 1024); /* Resized 1024x1024 */
            
            
            compOverlay('elexLogo.png', 300, 300,  `./public/imagesContainer/${updatedUser.image}` , `${updatedUser.id}Profile300x300`, "300x300"); /* 300x300 images */
            compOverlay('elexLogo.png', 700, 700,  `./public/imagesContainer/${updatedUser.image}` , `${updatedUser.id}Profile700x700`, "700x700"); /* 300x300 images */
            compOverlay('elexLogo.png', 1024, 1024,  `./public/imagesContainer/${updatedUser.image}` , `${updatedUser.id}Profile1024x1024`, "1024x1024"); /* 300x300 images */


            return response(res, 200, "Success",  "User updated successfully" , updatedUser);
        } catch (err) {

            return response(res, 500, "error",  "Failed to update user image" , null);
        }
    } 
)
/*____________________________________________________________________*/

router.route('/login').get(login)   /* Route for login */
router.route("/details").get(tokenExist, authMiddleware, getDetails) /* Route for get details */



module.exports = router