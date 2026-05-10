import { NotificationType } from "src/types/db.types";
import { firebaseMessaging } from "./firebase.provider";

export async function sendPush(notification:NotificationType)
{
    await firebaseMessaging.send({
        token: ,

        notification: {
            title: notification.title,
            body: notification.body,
        },
    });
}