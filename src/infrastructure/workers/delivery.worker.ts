import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis";


const worker = new Worker('delivery-queue', 
                         async(job)=>{console.log("Recievied Job"); console.log(job.data);},
                         {connection:redisConnection});


//Life Cycle Event Listener
worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.log(`Job ${job?.id} failed`);
    console.log(err);
});