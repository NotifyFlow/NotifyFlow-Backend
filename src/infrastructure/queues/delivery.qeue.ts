import { Queue } from "bullmq";
import { redisConnection} from "../../config/redis"

export const deliveryQueue = new Queue('delivery-queue',{connection:redisConnection});

