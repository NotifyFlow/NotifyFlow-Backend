import { Job } from "bullmq";
import { JobData,JobType } from "../../types/workers.types";
import { claimPendingDelivery, setFailedById, setPendingById, setSentById } from "../../db/queries/notificationdelivery.query";
import { getNotificationById } from "../../db/queries/notifications.query";
import pushHandler from "../handlers/push.handler";


export default async function processDelivery(job:Job)
{
    const handlerMap ={
        "SEND_PUSH":pushHandler,
        //"SEND_EMAIL":null
    }
    const data:JobData = job.data;
    const deliveryId = data.deliveryId;
    try{
        const delivery = await claimPendingDelivery(deliveryId);
        if(!delivery)
            return;
        const notification = await getNotificationById(delivery.notificationId);
        
        const jobName= job.name as JobType;

        let isSent=false;
        if(jobName === "SEND_IN_APP")
            isSent=true;

        if(handlerMap[jobName])
        {
            handlerMap[jobName](notification);
        }

        console.log(`[PUSH] delivery=${deliveryId} successfully sent!`);
        await setSentById(deliveryId);
    }
    
    catch(e)
    {   
        const maxAttempts = job.opts.attempts ?? 3;
        (job.attemptsMade +1 < maxAttempts) ? await setPendingById(deliveryId) : await setFailedById(deliveryId);
        throw e;
    }
}