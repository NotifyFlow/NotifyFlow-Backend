import crypto from "crypto";
const ALGORITHM = "aes-256-gcm";


const ENCRYPTION_KEY = Buffer.from(process.env.MASTER_ENCRYPTION_KEY!,"hex");

if (ENCRYPTION_KEY.length !== 32) 
    throw new Error("MASTER_ENCRYPTION_KEY must be 32 bytes (64 hex chars)");


const IV_LENGTH = 12; 
const AUTH_TAG_LENGTH = 16;

export function encrypt(plainText: string): string {

    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM,ENCRYPTION_KEY,iv);

    const encrypted = Buffer.concat([cipher.update(plainText, "utf8"),cipher.final()]);

    const authTag = cipher.getAuthTag();

    
    return [iv.toString("hex"),authTag.toString("hex"),encrypted.toString("hex")].join(":");
}

export function decrypt(encryptedPayload: string): string 
{

    const parts = encryptedPayload.split(":");

    if (parts.length !== 3) 
        throw new Error("Invalid encrypted payload format");


    const [ivHex, authTagHex, encryptedHex] =parts;

    const iv = Buffer.from(ivHex, "hex");

    const authTag = Buffer.from(authTagHex,"hex");

    const encryptedText = Buffer.from(encryptedHex,"hex");

    const decipher = crypto.createDecipheriv(ALGORITHM,ENCRYPTION_KEY,iv);
                                            
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encryptedText),decipher.final()]);

    return decrypted.toString("utf8");
}