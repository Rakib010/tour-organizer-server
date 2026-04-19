/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";    // For rendering email HTML templates
import nodemailer from "nodemailer";
import path from "path";  // Helps locate the template file
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

const smtpPort = Number(envVars.EMAIL_SENDER.SMTP_PORT);
const transporter = nodemailer.createTransport({
    // 465 => implicit TLS, 587 => STARTTLS (secure: false)
    secure: smtpPort === 465,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    },
    port: smtpPort,
    host: envVars.EMAIL_SENDER.SMTP_HOST,
})

interface SendEmailOptions {
    to: string,
    subject: string;
    templateName: string;
    templateData?: Record<string, any>
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments
}: SendEmailOptions) => {
    try {
        // Local dev convenience: if SMTP is not configured, don't fail business flows (OTP/payment).
        const smtpUser = (envVars.EMAIL_SENDER.SMTP_USER || "").trim();
        const smtpPass = (envVars.EMAIL_SENDER.SMTP_PASS || "").trim();
        const looksLikePlaceholder =
            !smtpUser ||
            !smtpPass ||
            smtpUser.includes("your_email") ||
            smtpPass.includes("your_email_app_password");

        if (envVars.NODE_ENV === "development" && looksLikePlaceholder) {
            // eslint-disable-next-line no-console
            console.warn("SMTP not configured; skipping email send in development.");
            return;
        }

        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        })
        // eslint-disable-next-line no-console
        console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    } catch (error: any) {
        // console.log("email sending error", error.message);
        throw new AppError(401, "Email error", error)
    }

}