import { getEmailConfigByUserId } from "src/db/queries/useremailproviders.query";
import { NotificationType } from "src/types/db.types";
import { resendProvider } from "../provider/email/resend.provider";
import { decrypt } from "src/utils/encryption";
import { env } from "src/config/env";
import { NotRetyableError } from "src/utils/errorhandling";
import { setFailedById } from "src/db/queries/notificationdelivery.query";


export default async function emailHandler(notification:NotificationType)
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
            throw new NotRetyableError("Unsupported email provider")

        if(mode === "BYO" && !encryptedApiKey )
            throw new NotRetyableError("API Key not provided");

        if(mode === "BYO" && !fromMailId)
            throw new NotRetyableError("MailID not provided");

        const providerHandler = providerMap[provider];
        const from = (mode === "BYO") ? fromMailId! : "sample@email.com";

        if(!providerHandler)
            throw new NotRetyableError("Invlaid Provider");

        const apiKey = ( mode=== "BYO") ? decrypt(encryptedApiKey!) : env.RESEND_API_KEY;

        await providerHandler(from,apiKey,notification);    
    }  
    catch(e)
    {
        throw e;
    }    
}