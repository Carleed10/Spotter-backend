const express = require('express')
const verifyToken = require('../Middleware/verifyToken')
const { messageController, deleteController } = require('../Controllers/notificationController')


const notificationRouter = express.Router()

notificationRouter.get('/message', verifyToken, messageController)
notificationRouter.post('/deleteNotification/:id', verifyToken, deleteController)



module.exports = notificationRouter