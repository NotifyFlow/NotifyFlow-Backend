import { Job,  Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import processDelivery from "../processors/delivery.processor";



const worker = new Worker('IN_APP', 
                          inAppProcessing,
                         {connection:redisConnection});



async function inAppProcessing(job:Job)
{
    await processDelivery(job); 
}