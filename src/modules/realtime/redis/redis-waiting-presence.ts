import { redisConnection } from "src/config/redis";

const PREFIX = "waiting_presence:";

export async function storeWaitingPresenceDelivery(recipientId:string,deliveryId:string)
{
    await redisConnection.sadd(`${PREFIX}${recipientId}`,deliveryId)
}

export async function getWaitingPresenceDelivery(recipientId:string,)
{
    return await redisConnection.smembers(`${PREFIX}${recipientId}`)
}

export async function deleteWaitingPresenceDelivery(recipientId:string,deliveryId:string)
{
    await redisConnection.srem(`${PREFIX}${recipientId}`,deliveryId);
}

export async function clearWaitingPresenceDelivery(recipientId:string)
{
    await redisConnection.del(`${PREFIX}${recipientId}`);
}