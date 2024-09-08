const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        require : [true, 'Username is required'],
        unique : true
    },
    email : {
        type : String,
        require : [true, 'Email is required'],
        unique : true
    },
    password : {
        type : String,
        require : [true, 'Password is required'],
        unique : false
    },
    firstName : {
        type : String,
        // require : [true, 'First name is required']
    },
    lastName : {
        type : String,
        // require : [true, 'Lastname is required']
    },
    
    jobType: {
        type : String,
        enum: ['Full-time' , 'Part-time' , 'Internship']
        // require : [true, 'Jobtitle is required']
    },
    jobCategory : {
        type : String,
        enum: ['Software Development' , 'Data Processing', 'Cloud Computing' , 'Networking', 'Web Development', 'Game Development', 'Database Management', 'Emerging Technologies', 'Product Management', 'IT Consulting', 'IT Governance and Compliance', 'Telecommunications', 'Cloud Computing', 'Ghostwriting', '', 'Database Management', 'Public Relations', 'Copywriting']
        // require : [true, 'Jobtitle is required']
    },
    jobTitle : {
        type : String,
        // require : [true, 'Lastname is required']
    },
    education : {
        type : String,
        // require : [true, 'Education is required']
    },
    about : {
        type : String,
        // require : [true, 'About is required'],

    },
    x : {
        type : String,
        require : [true, 'X account is required'],
        // unique : true
    },
    country : {
        type : String,
        require : [true, 'Country is required']
    },
    city : {
        type : String,
        require : [true, 'City is required'],
    },
    fullAddress : {
        type : String,
        require : [true, 'FullAddress is required'],
    },
    instagram : {
        type : String,
        require : [true, 'Instagram account is required'],
        // unique : true
    },
    facebook : {
        type : String,
        require : [true, 'Facebook account is required'],
        // unique : true
    },
    linkedIn : {
        type : String,
        require : [true, 'Linked in account is required'],
        // unique : true
    },
    otp: { 
        type: String,
        require: true
    },
    resetOtp: {
        code: { type: String },
        expiresAt: { type: Date }
    },
    imageUrl : {
        type : String,
        default : null
    },
    resumeUrl : {
        type : String,
        default : null
    }
})


const userModel = mongoose.model("userSchema", userSchema)
module.exports = userModel