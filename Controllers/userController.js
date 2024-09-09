const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require("../Models/userModel")
const { Signupmail } = require('../Utils/Signupmail')
const { Deletemail } = require('../Utils/Deletemail')
const crypto = require('crypto')
const { Otpmail } = require('../Utils/Otpmail')
const jobModel = require('../Models/jobModel')
const { cloudinary } = require('../Config/cloudinary')


// const genRandom = () => {
//     let otp = ""

//     for (let index = 0; index < 6; index++) {
//         const randomNumber = Math.floor(Math.random() *7)
//         otp += randomNumber
//     }
//     return otp

// }

const signUp = async (req, res)=>{
    const {userName, email, password} = req.body
    if (!userName || !email || !password) {
        res.status(400).send({message : 'All fields are mandatory'})
    }else{
        try {
            const verifyUserName = await userModel.findOne({
                userName
            })
            const verifyEmail = await userModel.findOne({
                email
            })

            if (verifyUserName && verifyEmail) {
                res.status(400).send({message : 'User already exist'})
            }
            if(verifyUserName){
                res.status(401).send({message : 'Username already in use'})
            }
            if(verifyEmail){
                res.status(402).send({message : 'Email already in use'})
            }
            else{
                const hashedPassword = await bcryptjs.hash(password, 5)
                const createUser = await userModel.create({
                    userName,
                    email,
                    password : hashedPassword
                })

                if (!createUser) {
                    res.status(409).send({message : 'Unable to create user', status : false})
                } else {
                    await Signupmail(userName, email)
                    res.status(200).send({message : 'User created successfully', status:true})
                    console.log("Created user :", createUser);
                }
            }

        } catch (error) {
            res.status(500).send({message : error.message, status : false})
            console.log(error);
            console.log("Sign up error, pls try again");
            
        }
    }
}


const login = async (req, res)=>{
    const{email, userName, password} = req.body

    if (!email, !password) {
        res.status(400).send({message : 'All fields are mandatory'})
    } else {
        try {
            const findUser = await userModel.findOne({email})
            if (!findUser) {
                res.status(400).send({message : 'User does not exist, pls sign up'})
            }
            else{
                const comparePassword = await bcryptjs.compare(password, findUser.password)
                const secretKey = process.env.SECRET_KEY
                if (!comparePassword) {
                res.status(400).send({message : 'Password does not match, pls try again'})
                    
                } else {
                    const genToken = jwt.sign({
                        user : {userName:findUser.userName, email, id : findUser._id}
                    },
                    secretKey,{
                        expiresIn : '1d'
                    }
                )

                res.status(200).send({message : 'Login successful', genToken, status : 'success', Username : findUser.userName})

                }
            }
           

        } catch (error) {
            res.status(400).send({message : 'Internal server error'})
            console.log('Login error, pls try again later');
            console.log(error);
        }
    }
    
}

const forgotPassword = async (req, res) => {
    const {email} = req.body
    console.log(req.body);

    if (!email) {
        res.status(400).send({message : "Email is required"})
    } else {
        try {
            const validateEmail = await userModel.findOne({email})
            const userName = validateEmail.userName

            if (!validateEmail) {
                res.status(400).send({message : "User doesn't exist, please sign up"})
            } else {
                const otps = await crypto.randomBytes(3)
                const userOtp = otps.toString("hex")
                const otpExpiresAt = Date.now() + 60 * 1000;

                validateEmail.resetOtp = {
                    code: userOtp,
                    expiresAt: otpExpiresAt
                };
                await validateEmail.save();

                await Otpmail(userName, userOtp, email, )
                res.status(200).send({message : "OTP sent successfully", userOtp})     
        }

        } catch (error) {
            res.status(500).send({message:"internal server error"})  
            console.log(error);
        }
    }

}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).send({ message: "Email and OTP are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user || !user.resetOtp) {
            return res.status(400).send({ message: "Invalid request" });
        }

        const { code, expiresAt } = user.resetOtp;

        if (Date.now() > expiresAt) {
            return res.status(400).send({ message: "OTP has expired, generate a new one", status : 'false' });
        }

        if (code !== otp) {
            return res.status(400).send({ message: "Invalid OTP" });
        }

        // OTP is valid, proceed with password reset or other actions
        res.status(200).send({ message: "OTP verified successfully", status : 'true' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
};

const editPassword = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        res.status(400).send({message : 'All fields are mandatory'})
    } else {
       try {
        const findUser = await userModel.findOne({email})
        if (!findUser) {
            res.status(400).send({message : 'User does not exist'})
        } else {
            const hashedPassword = await bcryptjs.hash(password, 5)
            const newPassword = await userModel.findOneAndUpdate({email}, {
                 password : hashedPassword 
            }, {new : true})

            if (!newPassword) {
                res.status(400).send({message : 'Unable to update password, try again'})
            }else{
                res.status(200).send({message : 'Password updated successfully'})

            }
        }
       } catch (error) {
            res.status(500).send({message : 'Internal server error'})
       }
     }

}




const deleteAccount = async (req, res) =>{
    const user = req.user
    if (!user) {
        res.status(400).send({message : 'Authorisation not provided'})
        console.log(req.user);
    } else {
        const {userName, email} = user
        try {
            const findUser = await userModel.findOneAndDelete({email})

            if (findUser) {
                await jobModel.deleteMany({creator : findUser._id})
                await Deletemail(userName, email)
                res.status(200).send({message : 'Account deleted successfully'})
                console.log('Deleted user : ',  findUser);
            }else{
                res.status(400).send({message : 'Unable to delete account'})
            }
        } catch (error) {
            res.status(500).send({message : 'Internal server error'})
            
        }
        
    }
}


const profile = async (req, res) => {
    const user = req.user
    console.log(user.email);
    const {email} = user

    const {firstName, lastName, jobTitle, jobType, jobCategory, education, about, facebook, x, linkedIn, instagram, city, country, fullAddress} = req.body
    
    if (!firstName, !lastName, !jobType, !jobTitle, !jobCategory, !education, !about, !facebook, !x, !linkedIn, !instagram, !city, !country, !fullAddress) {
        res.status(400).send({message : 'All fields are mandatory'})
    }else{
        try {
            const profileForm = await userModel.findOneAndUpdate({email}, { 
              $set : {firstName : firstName , lastName : lastName, jobType : jobType, jobTitle : jobTitle, jobCategory : jobCategory, education : education, about : about, facebook : facebook, x : x, linkedIn : linkedIn , instagram : instagram, city : city, country : country, fullAddress : fullAddress}
            }, {new : true})
            if (!profileForm) {
                res.status(400).send({message : "Unable to update profile"})
            }else{
                res.status(200).send({message : "Profile updated successfully"})

            }
        } catch (error) {
            res.status(500).send({message : 'Internal server error'})
        }
    }
}

const getProfile = async (req, res) => {
    const user = req.user
    if (!user) {
        res.status(400).send({message : "Authorization error"})
    } else {
        const {email} = user
        try {
            const users = await userModel.findOne({email})
            if (!users) {
            res.status(400).send({message : "Unable to get information"})
                
            } else {
                const findProfile= await userModel.findOne({email})
                res.status(200).send({message : "User information fetched successfully", status:"okay", findProfile})
                
            }
        } catch (error) {
            res.status(500).send({message : "Internal server error"})
            
        }
    }
}



const image = async (req, res) => {
    const user = req.user;
    console.log(user.email);
    const { email } = user;
    const { imageUrlcc } = req.body;

    if (!imageUrl) {
        return res.status(400).send({ message: 'Image is required' });
    }

    try {
        const imageUpload = await cloudinary.uploader.upload(imageUrl, { folder: 'Profile image' });
        const imageLink = imageUpload.secure_url;

        const imageForm = await userModel.findOneAndUpdate({ email }, {
            $set: { imageUrl : imageLink }
        }, { new: true });

        if (!imageForm) {
            return res.status(400).send({ message: "Unable to update image" });
        }

        res.status(200).send({ message: "Profile updated successfully", imageForm, imageLink});
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
        console.log(error);
    }
}

const resume = async (req, res) => {
    const user = req.user;
    console.log(user.email);
    const { email } = user;
    const { resumeUrl } = req.body;

    if (!resumeUrl) {
        return res.status(400).send({ message: 'Resume is required' });
    }

    try {
        const resumeUpload = await cloudinary.uploader.upload(resumeUrl, { folder: 'Profile resume' });
        const resumeLink = resumeUpload.secure_url;

        const resumeForm = await userModel.findOneAndUpdate({ email }, {
            $set: { resumeUrl : resumeLink }
        }, { new: true });

        if (!resumeForm) {
            return res.status(400).send({ message: "Unable to update resume" });
        }

        res.status(200).send({ message: "Profile updated successfully", resumeForm, resumeLink});
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
        console.log(error);
    }
}


module.exports = {signUp, login, deleteAccount, profile, forgotPassword, editPassword, verifyOtp, resume, image, getProfile}
