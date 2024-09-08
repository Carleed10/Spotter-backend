const express = require('express')
const { signUp, login, deleteAccount, editPassword, forgotPassword, profile, social, address, getProfile, verifyOtp, image, resume} = require('../Controllers/userController')
const { validateUser, validateSchema, validateLoginSchema } = require('../Middleware/validator')
const verifyToken = require('../Middleware/verifyToken')

const userRouter = express.Router()

userRouter.post('/signUp', validateUser(validateSchema),   signUp)
userRouter.get('/signup',    signUp)

userRouter.post('/login', validateUser(validateLoginSchema) , login)
userRouter.post('/deleteAccount', verifyToken, deleteAccount)
// userRouter.post('/delete', verifyToken, deleteAccount)
userRouter.post('/editPassword', editPassword)
userRouter.post('/profile', verifyToken, profile)
// userRouter.post('/social', verifyToken, social)
// userRouter.post('/address', verifyToken, address)
userRouter.get('/getProfile', verifyToken, getProfile)
userRouter.post('/postImage', verifyToken, image)
userRouter.post('/postResume', verifyToken, resume)



userRouter.post('/forgotPassword', forgotPassword)
userRouter.post('/verifyOtp', verifyOtp)

// userRouter.post('/verifyOtp', verifyOtp)





module.exports = userRouter