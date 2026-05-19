import {type NotificationType } from "src/types/db.types";
import { redisPubClient } from "../realtime/redis/redis-pubsub";
import { DeliveryProviderResult } from "src/types/infra/infra.type";


export default async function inAppHandler(notification:NotificationType):Promise<DeliveryProviderResult>
{
    const recipientId = notification.recipientId;
    await redisPubClient.publish("realtime.notifications",JSON.stringify({
                                                                    type:notification.type,
                                                                    recipientId:recipientId,
                                                                    payload:{
                                                                            notificationId:notification.id,
                                                                            notificationType:notification.type,
                                                                            title:notification.title,
                                                                            body:notification.body,
                                                                            createdAt:notification.createdAt}}));
    console.log(`[PUBLISHED] Notification ${notification.id} is published into pub-sub`); 
    return {
        provider:"SOCKER_IO"
    }                                                                     
}

