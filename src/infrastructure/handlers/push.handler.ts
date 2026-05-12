import { NotificationType } from "src/types/db.types";
import { sendPush } from "../provider/push/push.provider";
import { getFcmByRecipientId } from "src/db/queries/user-devices.query";


export default async function pushHandler(notification:NotificationType)
{
    const fcmToken = await getFcmByRecipientId(notification.recipientId);
    await sendPush(notification,fcmToken.map(device=>device.fcmToken));
}