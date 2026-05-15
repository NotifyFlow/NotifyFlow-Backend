import { NotificationType } from "src/types/db.types";
import nodemailer from "nodemailer";

export async function resendProvider(fromMailId:string,apiKey:string,notification:NotificationType)
{
    const transporter = nodemailer.createTransport({
                                                    host: 'smtp.resend.com',
                                                    secure: true,
                                                    port: 465,
                                                    auth: {
                                                    user: 'resend',
                                                    pass: apiKey,
                                                    },
                                                    });
    
    const info = await transporter.sendMail({
                                                from: fromMailId,
                                                //@ts-ignore
                                                to: notification.email,
                                                subject: notification.title,
                                                html: `<title>${notification.title}</title>
                                                       <body>${notification.body}</body>`,
                                            });
}