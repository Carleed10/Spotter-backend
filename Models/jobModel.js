const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
        jobTitle: {
        type : String,
        require : [true, 'Jobtitle is required']
        },

        jobCategory : {
            type : String,
            enum: ['Software Development' , 'Data Processing', 'Cloud Computing' , 'Networking', 'Web Development', 'Game Development', 'Database Management', 'Emerging Technologies', 'Product Management', 'IT Consulting', 'IT Governance and Compliance', 'Telecommunications', 'Cloud Computing', 'Ghostwriting', '', 'Database Management', 'Public Relations', 'Copywriting'],
            require : [true, 'JobCategory is required']
        },

        companyName : {
            type : String,
            require : [true, 'Company name is required']
        },

        vacancies: {
            type : String,
            // enum: ['Full time' , 'Part time' , 'Internship'],
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
        timestamp : {type: Date, default : Date.now}       

}, {timestamps : true})

const jobModel = mongoose.model("jobSchema", jobSchema)
module.exports = jobModel


