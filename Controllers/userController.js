const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require("../Models/userModel")


const genRandom = () => {
    let otp = ""

    for (let index = 0; index < 6; index++) {
        const randomNumber = Math.floor(Math.random() *7)
        otp += randomNumber
    }
    return otp
    // console.log(randomNumber);
}

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
    const{email, password} = req.body

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
                        user : {userName:findUser.userName, email}
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
        }
    }
    
}

const forgotPassword = (req, res) => {
    const {email} = req.body
    console.log(req.body);

    if (!email) {
        res.status(400).send({message : "Email is required"})
    } else {
        try {
            const validateEmail = userModel.findOne({email})

            if (!validateEmail) {
                res.status(400).send({message : "User doesn't exist, please sign up"})
            } else {
                let userOtp = genRandom()
                res.status(200).send({message : "OTP sent successfully", userOtp})                
            }

        } catch (error) {
            res.status(500).send({message:"internal server error"})  
            console.log(error);
        }
    }

}

const editPassword = async (req, res) => {
    const user = req.user
    if (!user) {
        res.status(400).send({message : 'Authorization error'})
    } else {
       try {
        const {password} = req.body
        const {email} = req.user

        const findUser = await userModel.findOne({email})
        if (!findUser) {
            res.status(400).send({message : 'Unable to edit password'})
            
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

    const {firstname, lastname, jobType, jobCategory, education, about} = req.body
    
    if (!firstname, !lastname, !jobType, !jobCategory, !education, !about) {
        res.status(400).send({message : 'All fields are mandatory'})
    }else{
        try {
            const profileForm = await userModel.findOneAndUpdate({email}, { 
              $set : {firstName : firstname , lastName : lastname, jobType : jobType, jobCategory : jobCategory, education : education, about : about}
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

const address = async (req, res) => {
    const user = req.user
    const {email} = user

    const {city, country, fullAddress} = req.body
    if (!city, !country, !fullAddress) {
        res.status(400).send({message : 'All fields are mandatory'})
    } else {
        try {
            const socialForm = await userModel.findOneAndUpdate({email}, {
                $set : {city : city, country : country, fullAddress : fullAddress}
            }, {new : true})

            if (!socialForm) {
                res.status(400).send({message : 'Unable to update profile'})
            } else {
                res.status(200).send({message : 'Profile updated successfully'})
            }
        } catch (error) {
            res.status(500).send({message : 'Internal server error'})
            
        }
    }
}

const social = async (req, res) => {
    const user = req.user
    const {email} = user

    const {facebook, x, linkedIn, instagram} = req.body
    if (!facebook, !x, !linkedIn, !instagram) {
        res.status(400).send({message : 'All fields are mandatory'})
    } else {
        try {
            const socialForm = await userModel.findOneAndUpdate({email}, {
                $set : {facebook : facebook, x : x, linkedIn : linkedIn , instagram : instagram}
            }, {new : true})

            if (!socialForm) {
                res.status(400).send({message : 'Unable to update profile'})
            } else {
                res.status(200).send({message : 'Profile updated successfully'})
            }
        } catch (error) {
            res.status(500).send({message : 'Internal server error'})
            
        }
    }
}



module.exports = {signUp, login, deleteAccount, profile, social, address, forgotPassword, editPassword}