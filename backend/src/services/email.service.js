import dotenv from 'dotenv'
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        clientId: process.env.CLIENT_ID
    }
})

export async function verifyMailServer() {
    try {
        await transporter.verify();
        console.log("✅ Email server ready to send mail");
    } catch (err) {
        console.error("❌ Email server error:", err);
    }
}

export async function sendEmail({ to, subject, html, text }) {
    try {

        console.log("📩 Sending email to:", to);

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
            text
        });

        console.log("✅ Email sent successfully:", info.messageId);

    } catch (error) {
        console.error("❌ Email Error:", error);
    }
}