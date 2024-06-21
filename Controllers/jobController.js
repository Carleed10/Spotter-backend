const jobModel = require("../Models/jobModel")
const userModel = require("../Models/userModel")

const jobController = async (req, res) => {
    const user = req.user

    if (!user) {
        res.status(400).send({message : "Authorization error"})
    } else {
        const {email} = user
        const {jobTitle, jobCategory,  companyName, vacancies, jobType, salary, jobDescription, requirement} = req.body

    if (!jobTitle || !jobCategory || !companyName || !vacancies || !jobType || !salary || !jobDescription || !requirement) {
        res.status(400).send({message : 'All fields are mandatory'})
    } else {
        try {
            const users = await userModel.findOne({email})
           if (!users) {
                res.status(400).send({message : 'Not eligible to post job'})
           } else { 
            const createJob = await jobModel.create({
                jobTitle, 
                jobCategory,  
                companyName,
                vacancies, 
                jobType, 
                salary, 
                jobDescription, 
                requirement,
                email : email
            })
            if (!createJob) {
                res.status(400).send({message : 'Error'})
            } else {
                res.status(200).send({message : 'Job created successfully', users : users.email})
                
            }
           }
        } catch (error) {
            res.status(500).send({message : 'Internal server error', status : false})
            console.log(error)
        }
    }

    }
    
}

const getJob = async (req, res)=>{
    const user = req.user
    if (!user) {
        res.status(400).send({message : "Authorization error"})
    } else {
        const {email} = user
        try {
            const users = await userModel.findOne({email})
            if (!users) {
            res.status(400).send({message : "Unable to get jobs"})
                
            } else {
                const findJob = await jobModel.find()
                res.status(200).send({message : "Jobs fetched successfully", status:"okay", findJob})
                
            }
        } catch (error) {
            res.status(500).send({message : "Internal server error"})
            
        }
    }


     
}

const jobDetails = async (req, res)=>{
    const user = req.user
        

    if (!user) {
        res.status(400).send({message : 'Authorization error'})
    } else {
        const {email} = user
        const id = req.params.id

        if (!id) {
          res.status(400).send({message:'id is not provided'})
            
        } else {
            const jobDetails = await jobModel.findById(id)
    
        if (!jobDetails) {
            res.status(400).send({message : "Unable to get job details"})
            // console.log(error);
        } else {
            try {
                res.status(200).send({message : "Job details fetched successfully", status:"okay", jobDetails})
            } catch (error) {
                console.log(error);
                res.status(500).send({message : "Internal server error"})
    
            }
        }
        }
    }
}

const createdJob = async (req, res) => {
        const user = req.user.email
        console.log(user);

        if (!user) {
            res.status(400).send({message : 'Authorisation not provided'})
        } else {
            try {
                const {email} = req.user
            const created =  await userModel.findOne({email})
                if (!created) {
                    res.status(404).send({message : "Unable to find job"})
                } else {
                    const createdJob = await jobModel.find({email}) .populate("email", "userName")
                    .populate("applicants", "userName");              
                    if (!createdJob) {
                    res.status(404).send({message : "Unable to get created jobs"})
                    } else {
                        res.status(200).send({message : "Success", createdJob})
                    }
                    
                }
            } catch (error) {
                res.status(500).send({message : "Internal server error"})
                console.log(error);
            }
        }

}

const applyJob = async (req, res) => {
    const user = req.user.email
    console.log(user);

    if (!user) {
        res.status(400).send({message : 'Authorisation not provided'})
    } else {
        try {
            const {email} = req.user
        const apply =  await userModel.findOne({email})
        if (!apply) {
            res.status(400).send({message : "User not found"}) 
            } else {               
                const id = req.params.id
                if (!id) {
                  res.status(400).send({message:'id is not provided'})
                } else {
                    const jobApplication = await jobModel.findByIdAndUpdate(
                        id,
                        { applicants: apply._id } ,
                        { new: true}
                    )
                if (!jobApplication) {
                    res.status(400).send({message : "Unable to apply for job"})
                    console.log(error);
                } else {
                    
                    try {
                        res.status(200).send({message : "Job applied for successfully", status:"okay", jobApplication})
                    } catch (error) {
                        console.log(error);''
                        res.status(500).send({message : "Internal server error"})
                    }
                }
                }              
            }
        } catch (error) {
            res.status(500).send({message : "Internal server error"})
            console.log(error);
        }
    }
}

const appliedJob = async (req, res) => {
    const user = req.user.email
    console.log(user);

    if (!user) {
        res.status(400).send({message : 'Authorisation not provided'})
    } else {
        try {
            const {email} = req.user
            const applied =  await userModel.findOne({email})
        // console.log(applied);
            if (!applied) {
                res.status(404).send({message : "Unable to find job"})
            } else {
                const appliedJobs = await jobModel.find({applicants: applied._id})
                if (!appliedJobs) {
                res.status(404).send({message : "Unable to get applied jobs"})
                } else {
                    res.status(200).send({message : "Success", appliedJobs})
                }
                
            }
        } catch (error) {
            res.status(500).send({message : "Internal server error"})
            console.log(error);
        }
    }

}

const applicants = async (req, res) => {
    const user = req.user.email
    console.log(user);

    if (!user) {
        res.status(400).send({message : 'Authorisation not provided'})
    } else {
        try {
            const {email} = req.user
        const created =  await userModel.findOne({email})
            if (!created) {
                res.status(404).send({message : "Unable to find job"})
            } else {
                const createdJob = await jobModel.find({email}) .populate("email", "userName")
                .populate("applicants", "userName");              
                if (!createdJob) {
                res.status(404).send({message : "Unable to get created jobs"})
                } else {
                    const id = req.params.id

                    if (!id) {
                             res.status(404).send({message : "Unable to get id"})
                        
                    } else {
                         const appli = await jobModel.findById(id).populate('applicants', 'userName');
                         if (!appli) {
                            res.status(404).send({message : "Unable to get applicants"})
                            
                         } else {
                            res.status(200).send({message : "Applicants gotten successfully", appli})
                            
                         }
                        
                    }

                }
                
            }
        } catch (error) {
            res.status(500).send({message : "Internal server error"})
            console.log(error);
        }
    }

}


const deleteJob = async (req, res) =>{
    const user = req.user.email
    console.log(user);

    if (!user) {
        res.status(400).send({message : 'Authorisation not provided'})
    } else {
        try {
            const {email} = req.user
        const created =  await userModel.findOne({email})
            if (!created) {
                res.status(404).send({message : "Not eligible to delete job"})
            } else {
                const id = req.params.id
                const deleteJob = await jobModel.findByIdAndDelete(id)
                if (!deleteJob) {
                res.status(404).send({message : "Unable to delete job"})
                } else {
                    res.status(200).send({message : "Job deleted Successfully", deleteJob})
                }
                
            }
        } catch (error) {
            res.status(500).send({message : "Internal server error"})
            console.log(error);
        }
    }
}



const acceptApplicants = async (req, res) => {
    const user =  req.user.email
    console.log(user);
    const id = req.params.id
    const { applicantId } = req.params;

    if (!user) {
        res.status(400).send({message : 'User not found'})
    } else {
        try {
            const {email} = req.user
            const accept =  await userModel.findOne({email})
            if (!accept) {
                res.status(404).send({message : "Not authorised to accept applicant"})
            } else {
                const job = await jobModel.findById(id).populate('applicants', 'userName');
                if (!job) {
                    res.status(404).send({message : "Unable to find job"})
                    
                 } else {

                // const appliedJobs = await jobModel.find({applicants: applied._id})

                    const applicant = await jobModel.find({applicants: job._id})

                    if (!applicant) {
                    res.status(404).send({message : "Applicants not found for this job"})
                        
                    }else{
                    res.status(200).send({message : "Applicants accepted successfully"})
                        
                    }


                    
                 }
                
            }
        } catch (error) {
            res.status(500).send({message : "Internal server error"})
            console.log(error);
        }
    }
}

const declineApplicants = async (req, res) => {
    const user =  req.user.email
    console.log(user);

    if (!user) {
        res.status(400).send({message : 'Authorisation not provided'})
    } else {
        try {
            const {email} = req.user
        const created =  await userModel.findOne({email})
            if (!created) {
                res.status(404).send({message : "Not eligible to delete job"})
            } else {
                const id = req.params.id
                const deleteJob = await jobModel.findByIdAndDelete(id)
                if (!deleteJob) {
                res.status(404).send({message : "Unable to delete job"})
                } else {
                    res.status(200).send({message : "Job deleted Successfully", deleteJob})
                }
                
            }
        } catch (error) {
            res.status(500).send({message : "Internal server error"})
            console.log(error);
        }
    }
}




module.exports = {jobController, getJob, jobDetails, createdJob, applyJob, deleteJob, appliedJob, applicants, acceptApplicants, declineApplicants}


