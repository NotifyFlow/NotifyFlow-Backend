import { NotificationType } from "src/types/db.types";
import { firebaseMessaging } from "./firebase.provider";

export async function sendPush(notification:NotificationType)
{
    await firebaseMessaging.send({
        token: "e8QejV6gnKzOQshgIQUvlo:APA91bG-Q4Ep4ZI7TUGIKwu8hUB5L_EnF_uCnd3vRhDFFznCsmSIelHaEfSZwY3DcaVJZw0UkZdceAEWkbABOr9zui_f9YizUCiLoPHu_uoHKNSw4Y-FZy0",

        notification: {
            title: notification.title,
            body: notification.body,
        },
    });
}