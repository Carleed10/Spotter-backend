const nodemailer = require("nodemailer");

const Signupmail = async (userName, email) => {
    const messageTemplate = `
    <div>
      <h2>Hi ${userName}</h2>
      <div>
        Welcome to Spotter!
        <h4>We are excited to have you join our community of professionals and job seekers. Your account has been successfully created, and you're now ready to explore endless career opportunities. Here’s a quick guide to help you get started:</h4>
        <ul>
          <li>
            <strong>Create Your Profile:</strong><br />
            Log in to your account and create a detailed profile. Include your work experience, skills, and any other relevant information to stand out to potential employers.
          </li>
          <li>
            <strong>Search for Jobs:</strong><br />
            Use our advanced search tools to find job listings that match your skills and preferences. Filter by location, industry, and job type to narrow down your options.
          </li>
          <li>
            <strong>Apply for Jobs:</strong><br />
            Easily apply for jobs with just a few clicks. Upload your resume and cover letter to increase your chances of getting noticed by employers.
          </li>
          <li>
            <strong>Post Job Listings:</strong><br />
            Are you an employer? Post your job listings on our platform to reach a large pool of talented candidates. Customize your listing to attract the right applicants.
          </li>
          <li>
            <strong>Get Support:</strong><br />
            Our support team is here to assist you with any questions or issues. Visit our Help Center or contact us directly at spotter.ng@gmail.com for help.
          </li>
        </ul>
        <p>We are committed to helping you achieve your career goals. Your success is our priority, and we are constantly working to improve our platform. If you have any feedback or suggestions, we would love to hear from you.</p>
        <p>Thank you for choosing Spotter. We look forward to helping you find your dream job or the perfect candidate. Welcome aboard!</p>
        <h4>Best regards,<br />The Spotter Team</h4>
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

module.exports = { Signupmail };
