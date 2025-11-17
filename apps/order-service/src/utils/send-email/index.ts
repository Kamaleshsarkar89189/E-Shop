import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";

dotenv.config();

const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    host: "smtp.gmail.com",
    // port: Number(process.env.SMTP_PORT) || 587,
    port: 587,
    // service: process.env.SMTP_SERVICE,
    service: "gmail",
    auth: {
        // user: process.env.SMTP_USER,
        user: "circumstanceskamalesh@gmail.com",
        // pass: process.env.SMTP_PASS,
        pass: "comn yfrx cpvh tzae",
    },
})

// Rander an EJS email template
const renderEmailTemplate = async (templateName: string, data: Record<string, any>): Promise<string> => {
    const templatePath = path.join(
        process.cwd(),
        "apps",
        "auth-service",
        "src",
        "utils",
        "email-templates",
        `${templateName}.ejs`
    );
    return ejs.renderFile(templatePath, data);
};

// send an email using nodemailer
export const sendEmail = async (to: string, subject: string, templateName: string, data: Record<string, any>) => {
    try {
        const html = await renderEmailTemplate(templateName, data);

        await transporter.sendMail({
            // from: `<${process.env.SMTP_USER}>`,
            from: `"Auth Service" <circumstanceskamalesh@gmail.com>`,
            to,
            subject,
            html,
        });
        return true;
    } catch (error) {
        console.log("Error sending mail", error)
        return false;
    }
}