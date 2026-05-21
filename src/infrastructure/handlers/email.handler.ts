import { getEmailConfigByUserId } from "src/db/queries/useremailproviders.query";
import { DeliveryType, NotificationType } from "src/types/db.types";
import { resendProvider } from "../provider/email/resend.provider";
import { decrypt } from "src/utils/encryption";
import { env } from "src/config/env";
import { NotRetryableError } from "src/utils/errorhandling";


export default async function emailHandler(notification:NotificationType,delivery:DeliveryType)
{
    const providerMap = {
        "RESEND":resendProvider
    }
    try {
        const userEmailProviderConfig = await getEmailConfigByUserId(notification.userId);
        const mode = userEmailProviderConfig.mode;
        const provider = userEmailProviderConfig.provider;
        const encryptedApiKey = userEmailProviderConfig.encryptedApiKey;
        const fromMailId = userEmailProviderConfig.fromEmail;
     
        if(!provider)
            throw new NotRetryableError("Unsupported email provider")

        if(mode === "BYO" && !encryptedApiKey )
            throw new NotRetryableError("API Key not provided");

        if(mode === "BYO" && !fromMailId)
            throw new NotRetryableError("MailID not provided");

        const providerHandler = providerMap[provider];
        const from = (mode === "BYO") ? fromMailId! : "sample@email.com";

        if(!providerHandler)
            throw new NotRetryableError("Invlaid Provider");

        const apiKey = ( mode=== "BYO") ? decrypt(encryptedApiKey!) : env.RESEND_API_KEY;

        return await providerHandler(from,apiKey,notification);    
    }  
    catch(e)
    {
        throw e;
    }    
}