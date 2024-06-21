const nodemailer = require("nodemailer")



const forgotPasswordMail = () =>{



    nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.USER_EMAIL,
            password : process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to : email,
        subject : "Reset Password",
        text : "Test App",
        html : messageTemplate,
    }

    try {
        
    } catch (error) {
        
    }

}

module.exports = {forgotPasswordMail}