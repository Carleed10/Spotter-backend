const nodemailer = require("nodemailer");

const Otpmail = async (userName,  userOtp, email) => {
    const messageTemplate = `
    <div>
      <h2>Hi ${userName}</h2>
      <div>

        <h4>We received a request to reset the password for your Spotter account. Please use the One-Time Password (OTP) below to proceed with resetting your password:</h4>
        <h1>Your OTP : ${userOtp}</h1>
        
        <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email. Your account remains secure, and no changes will be made.</p>
        <p>For further assistance, feel free to contact our support team at spotter.ng@gmail.com.</p>
        <h4>Best regards,
        <br />The Spotter Team</h4>
      </div>
    </div>
 ` 

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: "WELCOME TO SPOTTER",
        text: "Congratulations! Your account has been successfully created.",
        html: messageTemplate,
    };

    try {
        const mail = await transporter.sendMail(mailOptions);
        if (mail) {
            console.log("Message sent successfully");
            return { message: "Email sent successfully" };
        }
    } catch (error) {
        console.log("Error sending email:", error.message);
        throw new Error("Error sending email");
    }
}

module.exports = { Otpmail };
