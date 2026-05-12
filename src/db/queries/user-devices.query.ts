import { PlatformType } from "src/types/db.types";
import { db } from "..";
import { userDevices } from "../schema";
import { eq } from "drizzle-orm";

export async function createUserDevice(userId:string,fcmToken:string,platform:PlatformType,recipientId:string,deviceId:string)
{
    const [record] = await db.insert(userDevices).values({userId,recipientId:recipientId,fcmToken:fcmToken,platform:platform,deviceId:deviceId}).onConflictDoUpdate({
        target:[userDevices.deviceId,userDevices.recipientId], set:{userId,recipientId,fcmToken,platform,deviceId,isActive:true,lastUsedAt:new Date(),updatedAt: new Date()}}).returning();
    return record;
}

export async function getFcmByRecipientId(recipientId:string)
{
    const fcmTokens = await db.select({fcmToken:userDevices.fcmToken}).from(userDevices).where(eq(userDevices.recipientId,recipientId));
    return fcmTokens;
}

export async function setInactive(fcmToken:string)
{
    await db.update(userDevices).set({isActive:false}).where(eq(userDevices.fcmToken,fcmToken));
    return;
}