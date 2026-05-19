import { NotificationType } from "src/types/db.types";
import { firebaseMessaging } from "./firebase.provider";
import { setInactive } from "src/db/queries/user-devices.query";
import { NotRetryableError } from "src/utils/errorhandling";

export async function sendPush(notification:NotificationType,fcmTokens:string[])
{
   if(fcmTokens.length===0)
    throw new NotRetryableError("No active Devices")

   const response = await firebaseMessaging.sendEachForMulticast({
    tokens:fcmTokens,
    notification:{
        title:notification.title,
        body:notification.body
    }
   });

   /*
    This response has the response State of Firebase, 
    It tells whether the FCM token is still valid
    If not valid, it will return false
    If false, the token is not active , we need to set
    */

   const inactiveFcmTokens:string[] = []; 
   let successCount = 0;
   let retyableFailureCount=0;
   let lastProviderErrorCode:string | undefined;
   let lastProviderErrorMessage:string | undefined;

   response.responses.forEach((result,idx)=>{            
                                if(result.success)
                                {
                                    successCount++;
                                    return;
                                }

                                const errorCode = result.error?.code;
                                const errorMessage = result.error?.message;

                                lastProviderErrorCode = errorCode;
                                lastProviderErrorMessage = errorMessage;
                                
                                if(errorCode === "messaging/registration-token-not-registered" || errorCode === "messaging/invalid-registration-token")
                                    inactiveFcmTokens.push(fcmTokens[idx]);
                                else
                                    retyableFailureCount++;
                                }
                                );

   await Promise.all(inactiveFcmTokens.map(async(fcmToken)=>{await setInactive(fcmToken);}))

    if(successCount > 0)
        return  {provider:"FCM"};
    else if(retyableFailureCount === 0 && inactiveFcmTokens.length > 0)
        throw new NotRetryableError(lastProviderErrorMessage ?? "Push delivery failed",lastProviderErrorCode);
    else
        throw Error(lastProviderErrorMessage ?? "Push delivery failed")
}