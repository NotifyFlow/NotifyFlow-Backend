import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema/schema";
import { subscriptionTierType } from "src/types/db.types";

export async function getUserByGoogleId(googelId:string)
{
    const [user] = await db.select().from(users).where(eq(users.googleId,googelId));
    return user;
}

export async function createUser(userName:string,googleId:string,email:string,subscriptionTier?:subscriptionTierType,profilePicture?:string)
{
    const [newUser] = await db.insert(users).values({userName,googleId,email,subscriptionTier,profilePicture}).returning();
    return newUser;
}

export async function getUserById(userId:string)
{
    const [user] = await db.select().from(users).where(eq(users.id,userId));
    return user;
}
