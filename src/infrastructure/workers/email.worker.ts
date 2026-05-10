import { Job, Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import processDelivery from "../processors/delivery.processor";



const worker = new Worker('EMAIL', 
                         processJob,
                         {connection:redisConnection});


async function processJob(job:Job)
{
    await processDelivery(job);   
}