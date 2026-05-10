import { Queue } from "bullmq";
import { redisConnection} from "../../config/redis"

export const inAppQueue = new Queue('IN_APP',{connection:redisConnection});