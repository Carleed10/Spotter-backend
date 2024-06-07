const express = require('express')
const { jobController, getJob } = require('../Controllers/jobController')


const jobRouter = express.Router()

jobRouter.post('/postjob', jobController)
jobRouter.get('/getjob', getJob)


module.exports = jobRouter