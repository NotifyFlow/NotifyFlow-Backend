import { PlatformType } from "src/types/db.types";
import { db } from "..";
import { userDevices } from "../schema/schema";
import { and, eq, max } from "drizzle-orm";

export async function createUserDevice(userId:string,fcmToken:string,platform:PlatformType,recipientId:string,deviceId:string)
{
    const [record] = await db.insert(userDevices).values({userId,recipientId:recipientId,fcmToken:fcmToken,platform:platform,deviceId:deviceId}).onConflictDoUpdate({
        target:[userDevices.deviceId,userDevices.recipientId], set:{userId,recipientId,fcmToken,platform,deviceId,isActive:true,lastUsedAt:new Date(),updatedAt: new Date()}}).returning();
    return record;
}


export async function refreshFcmTokenByDeviceId(deviceId:string,fcmToken:string)
{
    const [newRecord] = await db.update(userDevices).set({fcmToken:fcmToken}).where(eq(userDevices.deviceId,deviceId)).returning();
    return newRecord;
}

export async function getFcmByRecipientId(recipientId:string)
{
    const fcmTokens = await db.select({fcmToken:userDevices.fcmToken}).from(userDevices).where(and(eq(userDevices.recipientId,recipientId),eq(userDevices.isActive,true)));
    return fcmTokens;
}

export async function setInactive(fcmToken:string)
{
    await db.update(userDevices).set({isActive:false}).where(eq(userDevices.fcmToken,fcmToken));
    return;
}

export async function setDeviceInactiveByDeviceId(deviceId:string,recipientId:string)
{
    await db.update(userDevices).set({isActive:false}).where(and(eq(userDevices.deviceId,deviceId),eq(userDevices.recipientId,recipientId)));
    return;
}


export async function updateDeviceLastUsed(recipientId:string,deviceId:string)
{
    await db.update(userDevices).set({lastUsedAt:new Date(),updatedAt:new Date()}).where(and(eq(userDevices.recipientId,recipientId),eq(userDevices.deviceId,deviceId)));
    return;
}

export async function getLatestLastUsed(recipientId:string)
{
    const [{latestLastUsed}] = await db.select({latestLastUsed: max(userDevices.lastUsedAt)}).from(userDevices).where(and(eq(userDevices.recipientId,recipientId),eq(userDevices.isActive,true)));
    return latestLastUsed;
}