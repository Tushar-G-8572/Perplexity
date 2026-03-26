import dotenv from 'dotenv'
dotenv.config();
import {google} from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const createGmailClient = ()=>{
    const oauthClient = new OAuth2(
        (process.env.CLIENT_ID || "").trim(),
        (process.env.CLIENT_SECRET || "").trim(),
        "https://developers.google.com/oauthplayground"
    );

    oauthClient.setCredentials({
        refresh_token:(process.env.REFRESH_TOKEN || "").trim()
    })

    return google.gmail({version:'v1', auth:oauthClient})
}


const mailBody = (to,from,subject,message)=>{
    const str = [
        `To: ${to}`,
        `From: ${from}`,
        `Subject ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset-utf8`,
        '',
        message
    ].join('\n')

    return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g,'-')
    .replace(/\//g,'_')
    .replace(/=+$/,'')
}

export async function sendEmail({ to, subject, html, text }) {
    try {

        console.log("📩 Sending email to:", to);
        const gmail = createGmailClient();
        const rawMessage = mailBody(to,process.env.EMAIL_USER,subject,html || text);

        const info = await gmail.users.messages.send({
            userId:'me',
            requestBody:{
                raw:rawMessage
            }
        });

        console.log("✅ Email sent successfully:", info.messageId);
        return { success:true , message:"Email Send"}

    } catch (error) {
        console.error("❌ Email Error:", error);
        return {error:true , message: error.message}
    }
}