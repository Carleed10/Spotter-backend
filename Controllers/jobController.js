const jobModel = require("../Models/jobModel")

const jobController = async (req, res) => {
    const {jobTitle, jobCategory,  companyName, vacancies, jobType, salary, jobDescription, requirement} = req.body

    if (!jobTitle || !jobCategory || !companyName || !vacancies || !jobType || !salary || !jobDescription || !requirement) {
        res.status(400).send({message : 'All fields are mandatory'})
    } else {
        try {
            const createJob = await jobModel.create({
                jobTitle, 
                jobCategory,  
                companyName,
                vacancies, 
                jobType, 
                salary, 
                jobDescription, 
                requirement
            })
            if (!createJob) {
                res.status(400).send({message : 'Error'})
            } else {
                res.status(200).send({message : 'Job created successfully'})
                
            }
        } catch (error) {
            res.status(500).send({message : 'Internal server error', status : false})
            console.log(error)
        }
    }

}


const getJob = async (req, res)=>{
        const findJob = await jobModel.find()

        if (!findJob) {
            res.status(400).send({message : "Unable to get jobs"})
        } else {
            try {
                res.status(200).send({message : "Jobs fetched successfully", status:"okay", findJob})
            } catch (error) {
                console.log(error);
                res.status(500).send({message : "Internal server error"})

            }
        }
}

module.exports = {jobController, getJob}


