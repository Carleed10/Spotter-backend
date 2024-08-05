const notificationModel = require("../Models/notificationModel")

const messageController = async (req, res) => {
    const user = req.user
    console.log(user);
    if (!user) {
        res.status(400).send({message : "Authorization error"})
    } else {
        const notifications = await notificationModel.find({notificationUser : req.user.id})
        if (!notifications) {
        res.status(400).send({message : "Unable to send notification to the user"})
            
        } else {
        res.status(200).send({message : "Notification sent successfully", notifications})
            
        }
    }
}

const deleteController = async (req, res) => {
    const user = req.user
    console.log(user);

    if (!user) {
        res.status(400).send({message : "Authorization error"})
    } else {
        const id = req.params.id

        const deleteNotification = await notificationModel.findByIdAndDelete(id)

        if (!deleteNotification) {
        res.status(400).send({message : "Unable to delete notification"})
        
        } else {
        res.status(200).send({message : "Notification deleted successfully", deleteNotification})
            
        }
    }
}


const newController = async (req, res) => {
    const user = req.user
    console.log(user);

    if (!user) {
        res.status(400).send({message : "Authorization error"})
    } else {
        const all = await notificationModel.find()
    }
}




module.exports = {messageController, deleteController}
