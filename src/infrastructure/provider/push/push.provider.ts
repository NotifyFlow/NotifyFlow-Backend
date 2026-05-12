import { NotificationType } from "src/types/db.types";
import { firebaseMessaging } from "./firebase.provider";
import { setInactive } from "src/db/queries/user-devices.query";

export async function sendPush(notification:NotificationType,fcmTokens:string[])
{
   if(fcmTokens.length===0)
    throw new Error("No active Devices")

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
   const atleastOneSuccess = false;

   response.responses.map(async(result,idx)=>{
            
            if(result.success)
                return;

            const errorCode = result.error?.code;
            
            if(errorCode === "messaging/registration-token-not-registered" || errorCode === "messaging/invalid-registration-token")
                inactiveFcmTokens.push(fcmTokens[idx]);
   });

   await Promise.all(inactiveFcmTokens.map(async(fcmToken)=>{
    await setInactive(fcmToken);
   }))

   if(!atleastOneSuccess)
        throw new Error("Push Delivery failed");
}