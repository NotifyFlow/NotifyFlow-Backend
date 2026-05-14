export type PublishDataType = {
    type:string,
    recipientId:string,
    payload:{
        notificationId:string,
        notificationType:string,
        title:string,
        body:string,
        createdAt:Date
    }
}