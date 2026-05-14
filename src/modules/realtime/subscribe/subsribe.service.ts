import { Injectable, OnModuleInit } from "@nestjs/common";
import { NotificationEmitterService } from "../emitter/notification-emitter.service";
import { redisSubClient } from "src/infrastructure/realtime/redis/redis-pubsub";
import { PublishDataType } from "src/types/realtime.types";

@Injectable()
export class InAppNotificationSubscribeService implements OnModuleInit{
    constructor(private notificationEmitter:NotificationEmitterService){};
    
    /*
    OnModuleInit is a lifecyle Hook
    This Runs automatically when Nest Initializes provider or module
    */
    async onModuleInit()
    {
        await redisSubClient.subscribe("realtime.notifications");

        redisSubClient.on("message",async(channel,message:string)=>{
            if(channel !== "realtime.notifications")
                    return;
            const data:PublishDataType = JSON.parse(message);
            console.log(`[SUBSCRIBER] Going to emit to ${data.recipientId}`);
            this.notificationEmitter.emittor(data.recipientId,data.payload);
        });
    }
}