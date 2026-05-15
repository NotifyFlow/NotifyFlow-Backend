import { Job } from "bullmq";
import { JobData,JobType } from "../../types/workers.types";
import { claimPendingDelivery, setFailedById, setPendingById, setSentById } from "../../db/queries/notificationdelivery.query";
import { getNotificationById } from "../../db/queries/notifications.query";
import pushHandler from "../handlers/push.handler";
import inAppHandler from "../handlers/inapp.handler";
import emailHandler from "../handlers/email.handler";
import { NotRetyableError } from "src/utils/errorhandling";


export default async function processDelivery(job:Job)
{
    const handlerMap ={
        "SEND_PUSH":pushHandler,
        "SEND_IN_APP":inAppHandler,
        "SEND_EMAIL":emailHandler
    }
    const data:JobData = job.data;
    const deliveryId = data.deliveryId;
    try{
        const delivery = await claimPendingDelivery(deliveryId);
        if(!delivery)
            return;
        const notification = await getNotificationById(delivery.notificationId);
        
        const jobName= job.name as JobType;

        if(handlerMap[jobName])
        {
            console.log(`[PROCESSOR] Sent notification to ${jobName.split('',5)[1]}`)
            handlerMap[jobName](notification);
        }

        
        await setSentById(deliveryId);
        console.log(`[PUSH] delivery=${deliveryId} successfully sent!`);
    }
    
    catch(e)
    {   
        if(e instanceof NotRetyableError)
        {
            await setFailedById(deliveryId);
            return;
        }
        const maxAttempts = job.opts.attempts ?? 3;
        (job.attemptsMade +1 < maxAttempts) ? await setPendingById(deliveryId) : await setFailedById(deliveryId);
        throw e;
    }
}