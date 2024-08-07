const jobModel = require("../Models/jobModel")
const notificationModel = require("../Models/notificationModel")
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
                email : email,
                creator : users._id,
               
            })
            if (!createJob) {
                res.status(400).send({message : 'Error'})
            } else {
                const notify = await notificationModel.create({
                    notificationUser : users._id,
                    notificationMessage : `Your job ${jobTitle} job has been posted successfully.`
                })
                if (!notify) {
                    res.status(403).send({message : 'Unable to send notification', users : users.email, creator : users._id})        
                } else {
                    res.status(200).send({message : 'Job created successfully with notification', users : users.email, notify, creator : users._id})              
                }

                
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
    const user = req.user.email;
    console.log(user);
    const creator = req.user.id


    if (!user) {
        return res.status(400).send({ message: 'Authorization not provided' });
    }

    try {
        const { email } = req.user;
        const apply = await userModel.findOne({ email });

        if (!apply) {
            return res.status(400).send({ message: "User not found" });
        }

        
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({ message: 'Job ID is not provided' });
        }

        const jobApplication = await jobModel.findById(id).populate('creator');

        if (!jobApplication) {
            return res.status(400).send({ message: "Unable to get job" });
        }

        else if (jobApplication.creator._id.toString() === apply._id.toString()) {
            return res.status(403).send({ message: 'You cannot apply for your own job' });

        }
        else if (jobApplication.applicants.length >= jobApplication.vacancies) {
            return res.status(404).send({ message: 'Job vacancy is full, cannot apply' });
        }else{
            const applicantIds = jobApplication.applicants.map(applicant => applicant.userId.toString());
            if (applicantIds.includes(apply._id.toString())) {
            return res.status(402).send({ message: 'You have already applied for this job' });
            }else{
                const updateApplicant = await jobModel.findByIdAndUpdate(
                    id,
                    { $push: { applicants: { userId: apply._id } } },
                    { new: true }
                ).populate('creator');

                if (!updateApplicant) {
                    res.status(402).send({ message: 'Unable to apply for job' });
                } else {
                    const notify = await notificationModel.create({
                        notificationUser : creator,
                        notificationMessage : `A new applicant has applied for your job posting titled ${jobApplication.jobTitle}`
                    })
                    if (!notify) {
                        res.status(403).send({message : 'Unable to send notification', creator})        
                    } else {
                        res.status(201).send({message : 'Job applied for successfully with notification', deleteJob, notify, creator})              
                    }

                    // res.status(201).send({ message: 'Job applied for successfully' });
                    
                }
            
        }
        }

        

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
};

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
                const appliedJobs = await jobModel.find({ 'applicants.userId': applied._id }).populate("applicants.userId", "username")
                console.log(appliedJobs);
                if (!appliedJobs) {
                res.status(404).send({message : "Unable to get applied jobs"})
                } else {
                    res.status(200).send({message : "Success",  appliedJobs})
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
                const createdJob = await jobModel.find({email})      
                if (!createdJob) {
                res.status(404).send({message : "Unable to get created jobs"})
                } else {
                    const id = req.params.id

                    if (!id) {
                             res.status(404).send({message : "Unable to get id"})
                        
                    } else {
                         const appli = await jobModel.findById(id).populate('applicants.userId', "userName firstName imageUrl lastName jobTitle")
                         console.log(appli);
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

const applicantsProfile = async (req, res) => {
    const user = req.user.email
    console.log(user);
    
    if (!user) {
        res.status(400).send({message : 'Authorisation not provided'})
    } else {
        try {
            const {email} = req.user
        const created =  await userModel.findOne({email})
            if (!created) {
                res.status(404).send({message : "Unable to get user"})
            } else {
                const createdJob = await jobModel.find({email})      
                if (!createdJob) {
                res.status(404).send({message : "Unable to get created jobs"})
                } else {
                    const id = req.params.id

                    if (!id) {
                             res.status(404).send({message : "Unable to get id"})
                        
                    } else {
                         const applicantProfile = await userModel.findById({_id: id})
                         console.log(applicantProfile);
                         if (!applicantProfile) {
                            res.status(404).send({message : "Unable to get applicant profile"})
                            
                         } else {
                            res.status(200).send({message : "Applicants gotten successfully", applicantProfile})
                            
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
    const creator = req.user.id
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
                    const notify = await notificationModel.create({
                    notificationUser : creator,
                    notificationMessage : `The job you created titled ${deleteJob.jobTitle} has been successfully deleted.`
                })
                if (!notify) {
                    res.status(403).send({message : 'Unable to send notification', creator})        
                } else {
                    res.status(200).send({message : 'Job deleted Successfully with notification', deleteJob, notify, creator})              
                }
                    // res.status(200).send({message : "", deleteJob})
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
    const creator = req.user.id

    console.log(user);
    const {applicantId}  = req.body
    const id = req.params.id


    if (!user) {
        res.status(400).send({message : 'User not found'})
    } else {
        try {
            const {email} = req.user
            const accept =  await userModel.findOne({email})
            if (!accept) {
                res.status(404).send({message : "Not authorised to accept applicant"})
            } else {

                    

                    const applicant = await jobModel.findOneAndUpdate(
                        { _id: id, 'applicants.userId': applicantId },
                        { $set: { 'applicants.$.accepted': true, 'applicants.$.status' : 'Accepted' }},
                        {new: true}
                    )
                    console.log(applicant);

                    if (!applicant) {
                    res.status(404).send({message : "Applicant not found for this job"})
                        
                    }else{
                        const notifyUser = await notificationModel.create({
                            notificationUser : creator,
                            notificationMessage : `You've accepted an applicant`,

                        })
                        const notifyApplicant = await notificationModel.create({
                            notificationUser : applicantId,
                            notificationMessage : `Congratulations! You have been successfully accepted for the ${applicant.jobTitle} job position.`,
             
                        })
                        if (!notifyUser || !notifyApplicant) {
                            res.status(403).send({message : 'Unable to send notification', creator})        
                        } else {
                            res.status(200).send({message : 'Applicant accepted successfully with notification', applicant, notifyUser, notifyApplicant, creator})              
                        }


                    // res.status(200).send({message : "Applicant accepted successfully"})
                        
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
    const {applicantId}  = req.body
    const id = req.params.id
    const creator = req.user.id



    if (!user) {
        res.status(400).send({message : 'User not found'})
    } else {
        try {
            const {email} = req.user
            const accept =  await userModel.findOne({email})
            if (!accept) {
                res.status(404).send({message : "Not authorised to accept applicant"})
            } else {

                    const applicant = await jobModel.findOneAndUpdate(
                        { _id: id, 'applicants.userId': applicantId },
                        { $set: { 'applicants.$.accepted': false, 'applicants.$.status' : 'Declined' }},
                        {new: false}
                    )
                    console.log(applicant);

                    if (!applicant) {
                    res.status(404).send({message : "Applicant not found for this job"})
                        
                    }else{
                        const notifyUser = await notificationModel.create({
                            notificationUser : creator,
                            notificationMessage : `Notification for success, deleted successfully`,

                        })
                        const notifyApplicant = await notificationModel.create({
                            notificationUser : applicantId,
                            notificationMessage : `We regret to inform you that your application for the ${applicant.jobTitle} position has been declined. Thank you for your interest and effort. We encourage you to apply for other opportunities that match your skills and experience. Best of luck in your job search.`,
             
                        })
                        if (!notifyUser || !notifyApplicant) {
                            res.status(403).send({message : 'Unable to send notification', creator})        
                        } else {
                            res.status(200).send({message : 'Applicant accepted successfully with notification', applicant, notifyUser, notifyApplicant, creator})              
                        }
                        if (!notifyUser || !notifyApplicant) {
                            res.status(403).send({message : 'Unable to send notification', creator})        
                        } else {
                            const deleteApplicant = await jobModel.findOneAndDelete(
                                { _id: id },
                                { $pull: { applicants: { userId: applicantId } } },
                                { new: true }
                            )
                            if (!deleteApplicant) {
                                res.status(403).send({message : 'Unable to decline applicant', creator})          
                            }else{
                            res.status(200).send({message : 'Applicant declined successfully with notification', applicant, notify, creator})              
                                
                            }
                        }

                    // res.status(200).send({message : "Applicant declined successfully"})
                        
                    }
                
            }
        } catch (error) {
            res.status(500).send({message : "Internal server error"})
            console.log(error);
        }
    }
}





module.exports = {jobController, getJob, jobDetails, createdJob, applyJob, deleteJob, appliedJob, applicants, applicantsProfile, acceptApplicants, declineApplicants}


