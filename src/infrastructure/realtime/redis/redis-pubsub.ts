import Redis from "ioredis";

export const redisPubClient = new Redis({
    host:"localhost",
    port:6379
})

export const redisSubClient = new Redis({
    host:"localhost",
    port:6379
})