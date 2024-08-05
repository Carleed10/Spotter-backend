const mongoose = require('mongoose')


const notificationSchema = new mongoose.Schema({

    notificationUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userSchema',
    },
    notificationMessage : {
        type : String
    },
    applicantMessage : {
        type : String,
        default : null
    },

    timestamp : {type: Date, default : Date.now}       

    
}, {timestamps : true})

const notificationModel = mongoose.model("notificationSchema", notificationSchema)
module.exports = notificationModel