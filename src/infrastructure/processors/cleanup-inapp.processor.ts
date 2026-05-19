import { getStalePublishedDelivery, retryPublishedInAppDelivery, setFailedById, setPublishedById, setSentById } from "src/db/queries/notificationdelivery.query";
import { inAppQueue } from "../queues/inapp.queue";


export async function cleanUpProcessor()
{
    const stalePublishedDeliveries = await getStalePublishedDelivery();
    for(const delivery of stalePublishedDeliveries)
    {
        if(delivery.retryCount >= 3)
        {
            await setFailedById(delivery.id,"ACK Time-out exceeded","SOCKER_IO",undefined);
            continue;
        }
        await retryPublishedInAppDelivery(delivery.id);
        await inAppQueue.add("SEND_IN_APP",{dliveryId:delivery.id},{attempts:3,backoff:{type:"exponential",delay:5000},removeOnComplete:true});
    }
}