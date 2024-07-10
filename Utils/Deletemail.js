const nodemailer = require("nodemailer");

const Deletemail = async (userName, email) => {
    const messageTemplate = `
    <div>
      <h2>Hi ${userName}</h2>
      <div>

        <h4>We're sorry to see you go, but we understand and respect your decision. This email is to confirm that your account with Spotter has been successfully deleted.</h4>
        <h5>Here are a few things to note:</h5>
        
        <ul>
          <li>
            <strong>Data Removal:</strong><br />
            All your personal data, job applications, and job postings associated with your account have been permanently removed from our system.
          </li>
          <li>
            <strong>Access Termination:</strong><br />
            You will no longer be able to log in to your account or access any features of our platform.
          </li>
          <li>
            <strong>Rejoin Anytime:</strong><br />
            If you ever decide to come back, you're always welcome to create a new account.
          </li>
          <li>
            <strong>Get Support:</strong><br />
            Our support team is here to assist you with any questions or issues. Visit our Help Center or contact us directly at spotter.ng@gmail.com for help.
          </li>
        </ul>
        <p>If this was a mistake or you have any questions or concerns, please don't hesitate to contact our support team at spotter.ng@gmail.com.</p>
        <p>Thank you for being a part of [Your Company Name]. We wish you all the best in your future endeavors.</p>
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

module.exports = { Deletemail };
