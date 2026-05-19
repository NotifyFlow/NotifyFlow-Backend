import { NotificationType } from "src/types/db.types";
import nodemailer from "nodemailer";
import { DeliveryProviderResult } from "src/types/infra/infra.type";

export async function resendProvider(fromMailId:string,apiKey:string,notification:NotificationType):Promise<DeliveryProviderResult>
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
    return {
        provider:"RESEND",
        providerMessageId:info.messageId
    }
}