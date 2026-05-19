import { Job } from "bullmq";
import { JobData,JobType } from "../../types/workers.types";
import { claimPendingDelivery,setPublishedById, setFailedById, setPendingById, setSentById } from "../../db/queries/notificationdelivery.query";
import { getNotificationById } from "../../db/queries/notifications.query";
import pushHandler from "../handlers/push.handler";
import inAppHandler from "../handlers/inapp.handler";
import emailHandler from "../handlers/email.handler";
import { NotRetryableError } from "src/utils/errorhandling";
import { recordUsageEventByUserId } from "src/db/queries/usage-events.query";
import { DeliveryProviderResult } from "src/types/infra/infra.type";


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
        let deliveryResult: DeliveryProviderResult;
        const handler = handlerMap[jobName];

        if(!handler)
            throw new Error("Unsupported job type");

        console.log(`[PROCESSOR] Sent notification to ${jobName.split('_')[1]}`)
        deliveryResult = await handler(notification);
        
        if(jobName === "SEND_IN_APP")
        {
            await setPublishedById(deliveryId,deliveryResult.provider);
        }
        else
        {
            const delivery = await setSentById(deliveryId,deliveryResult.provider,deliveryResult.providerMessageId);
            await recordUsageEventByUserId(delivery.userId,(jobName==="SEND_EMAIL") ? "EMAIL_SENT" : "PUSH_SENT");
        }
        
        console.log(`[PUSH] delivery=${deliveryId} successfully sent!`);
    }
    
    catch(e)
    {   
        if(e instanceof NotRetryableError)
        {
            await setFailedById(deliveryId,e.message,undefined,e.providerErrorCode);
            return;
        }
        const maxAttempts = job.opts.attempts ?? 3;
        (job.attemptsMade +1 < maxAttempts) ? await setPendingById(deliveryId) : await setFailedById(deliveryId,"Ran out of retry attempts");
        throw e;
    }
}