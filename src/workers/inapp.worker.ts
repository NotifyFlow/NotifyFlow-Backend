import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";


const worker = new Worker('IN_APP', 
                         async(job)=>{console.log("Recievied Job"); console.log(job.data);},
                         {connection:redisConnection});
