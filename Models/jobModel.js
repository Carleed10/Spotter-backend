const mongoose = require('mongoose')
const { Schema, ref } = require('yup')
const userModel = require('./userModel')

const jobSchema = new mongoose.Schema({
        jobTitle: {
            type : String,
            require : [true, 'Jobtitle is required']
        },

        jobCategory : {
            type : String,
            enum: ['Software Development', 'Data Processing', 'Cloud Computing' , 'Networking', 'Web Development', 'Game Development', 'Database Management', 'Emerging Technologies', 'Product Management', 'IT Consulting', 'IT Governance and Compliance', 'Telecommunications', 'Cloud Computing', 'Ghostwriting', 'Database Management', 'Public Relations', 'Copywriting'],
            require : [true, 'JobCategory is required']
        },

        companyName : {
            type : String,
            require : [true, 'Company name is required']
        },

        vacancies: {
            type : Number,
            require : [true, 'Vacancy is required']
        },

        jobType: {
            type : String,
            enum: ['Full-time' , 'Part-time' , 'Internship'],
            require : [true, 'Job type is required']
        },
        
        salary: {
            type : String,
            require : [true, 'Salary is required']
        },

        jobDescription: {
            type : String,
            require : [true, 'Job Description is required']
        },
        
        requirement : {
            type : String,
            require : [true, 'Requirement is required']
        },
        email : {
            type : String,
            require : [true, 'Email is required'],
            // unique : true
        },
        applicants: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'userSchema',
                required: true
            },
            accepted: {
                type: Boolean,
                default: false
            },
            status : {
                type : String,
                default : 'Pending'
            }
        }],
        creator : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'userSchema',
        },
        
          

        timestamp : {type: Date, default : Date.now}       

}, {timestamps : true})

const jobModel = mongoose.model("jobSchema", jobSchema)
module.exports = jobModel


