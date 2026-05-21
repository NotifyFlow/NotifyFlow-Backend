export type PublishDataType = {
    type:string,
    recipientId:string,
    payload:{
        deliveryId:string,
        notificationId:string,
        notificationType:string,
        title:string,
        body:string,
        createdAt:Date
    }
}

export type DeliveryPlan = {
    channel:"PUSH",
    status:"PENDING"
}

export type RecipientState = {
   online:boolean;
   recentlyActive:boolean;
   inactiveDays:number;
   reachableByPush:boolean;
}

