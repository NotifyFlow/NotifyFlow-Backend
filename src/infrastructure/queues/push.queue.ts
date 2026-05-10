import '../../config/env';
import { Queue } from "bullmq";
import { redisConnection} from "../../config/redis"

export const pushQueue = new Queue('PUSH',{connection:redisConnection});