import { Job, Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import processDelivery from "../processors/delivery.processor";

const worker = new Worker('PUSH', 
                         pushNotificationProcessing,
                         {connection:redisConnection});


async function pushNotificationProcessing(job:Job)
{
    await processDelivery(job); 
}