const express = require('express')
const { jobController, getJob, jobDetails, createdJob, applyJob, deleteJob, appliedJob, applicants, acceptApplicants } = require('../Controllers/jobController')
const verifyToken = require('../Middleware/verifyToken')


const jobRouter = express.Router()

jobRouter.post('/postjob', verifyToken, jobController)
jobRouter.get('/getjob', verifyToken, getJob)
jobRouter.get('/createdJob', verifyToken, createdJob)
jobRouter.get('/appliedJob', verifyToken, appliedJob)
jobRouter.get('/jobDetails/:id', verifyToken, jobDetails)
jobRouter.get('/applicants/:id', verifyToken, applicants)
jobRouter.post('/applyJob/:id', verifyToken, applyJob)
jobRouter.post('/deleteJob/:id', verifyToken, deleteJob)
jobRouter.post('/acceptApplicant/:id', verifyToken, acceptApplicants)






module.exports = jobRouter