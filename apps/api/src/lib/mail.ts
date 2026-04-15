import { APIErrorResponse } from "@rum-core/shared";
import { Resend } from "resend";
import { getRedis } from "../../../../packages/db/src/services/cache.service";
import { ENV } from "../constants/envvars";

const resend = new Resend(ENV.RESEND_API_KEY);

async function sendEmail(email: string, subject: string, html: string) {
    try {
        const r = getRedis();
        const isMailAlreadySent = await r.get(email);
        if (isMailAlreadySent)
            throw new APIErrorResponse(
                "MailError",
                "Throttled, resend will be available in 5 minutes",
                "Mail already sent",
                400,
            );

        const res = await resend.emails.send({
            from: "rumcore@prabhatlabs.dev",
            to: email,
            subject,
            html,
        });
        if (res.error) {
            throw new APIErrorResponse(
                "MailError",
                res.error.message,
                "Failed to send email",
                500,
            );
        }
        await r.set(email, "send!", { ex: 300 });
    } catch (error: any) {
        if (error instanceof APIErrorResponse) {
            throw error;
        }
        throw new APIErrorResponse(
            "InternalServerError",
            error.message,
            "Failed to send email",
            500,
        );
    }
}

function sendEmailVerificationMail(email: string, verificationUrl: string) {
    return sendEmail(
        email,
        "RUM CORE - Email Verification",
        `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
    );
}

function sendPasswordResetMail(email: string, resetUrl: string) {
    return sendEmail(
        email,
        "RUM CORE - Password Reset",
        `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    );
}

const mail = {
    sendEmail,
    sendEmailVerificationMail,
    sendPasswordResetMail,
};

export default mail;
