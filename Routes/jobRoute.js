const express = require('express')
const { jobController, getJob, jobDetails, createdJob, applyJob, deleteJob, appliedJob, applicants, acceptApplicants, declineApplicants, applicantsProfile, pendingJobs, approvedJobs, partTimeJob, internship, fullTimeJob } = require('../Controllers/jobController')
const verifyToken = require('../Middleware/verifyToken')


const jobRouter = express.Router()

jobRouter.post('/postjob', verifyToken, jobController)
jobRouter.get('/getjob', verifyToken, getJob)
jobRouter.get('/createdJob', verifyToken, createdJob)
jobRouter.get('/appliedJob', verifyToken, appliedJob)
jobRouter.get('/pendingJob', verifyToken, pendingJobs)
jobRouter.get('/approvedJob', verifyToken, approvedJobs)
jobRouter.get('/partTimeJob', verifyToken, partTimeJob)
jobRouter.get('/internship', verifyToken, internship)
jobRouter.get('/fullTimeJob', verifyToken, fullTimeJob)
// jobRouter.post('/postCompanyLogo', verifyToken, companyLogo)






jobRouter.get('/jobDetails/:id', verifyToken, jobDetails)
jobRouter.get('/applicants/:id', verifyToken, applicants)
jobRouter.post('/applyJob/:id', verifyToken, applyJob)
jobRouter.post('/deleteJob/:id', verifyToken, deleteJob)
jobRouter.post('/acceptApplicant/:id', verifyToken, acceptApplicants)
jobRouter.post('/declineApplicant/:id', verifyToken, declineApplicants)
jobRouter.get('/applicantProfile/:id', verifyToken, applicantsProfile)




module.exports = jobRouter