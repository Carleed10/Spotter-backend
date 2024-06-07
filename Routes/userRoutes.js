const express = require('express')
const { signUp, login, deleteAccount, editPassword, forgotPassword, profile, social} = require('../Controllers/userController')
const { validateUser, validateSchema, validateLoginSchema } = require('../Middleware/validator')
const verifyToken = require('../Middleware/verifyToken')

const userRouter = express.Router()

userRouter.post('/signUp', validateUser(validateSchema),   signUp)
userRouter.get('/signup',    signUp)

userRouter.post('/login', validateUser(validateLoginSchema) , login)
userRouter.post('/deleteAccount', verifyToken, deleteAccount)
// userRouter.post('/delete', verifyToken, deleteAccount)
userRouter.post('/edit', verifyToken, editPassword)
userRouter.post('/profile', verifyToken, profile)
userRouter.post('/social', verifyToken, social)

userRouter.post('/forgotPassword', verifyToken, forgotPassword)




module.exports = userRouter