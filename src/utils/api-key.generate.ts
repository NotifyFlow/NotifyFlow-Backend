import crypto from "crypto";
import argon2 from "argon2";

const API_KEY_PREFIX = "naas_live_";

export async function generateApiKey() {

    const randomPart = crypto.randomBytes(32).toString("hex");

    const rawKey = `${API_KEY_PREFIX}${randomPart}`;

    const prefix = rawKey.slice(0,20);

    const hashedKey = await argon2.hash(rawKey);

    return { rawKey,prefix,hashedKey};
}