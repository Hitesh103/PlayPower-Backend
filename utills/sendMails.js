import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (email, subject, text) => {
    console.log(email);
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: process.env.EMAIL_PORT,
            secure: process.env.SECURE,
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: subject,
            text: text
        });

        console.log("Email sent");

    } catch (error) {
        console.log(error);
    }
}

export default sendEmail;
