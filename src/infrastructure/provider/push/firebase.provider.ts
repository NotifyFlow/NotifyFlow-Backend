

import admin from "firebase-admin";
import { env } from '../../../config/env';

// console.log(process.env.FIREBASE_PROJECT_ID);
// console.log(process.env.FIREBASE_CLIENT_EMAIL);
// console.log(process.env.FIREBASE_PRIVATE_KEY);

const firebaseApp = admin.initializeApp({
    credential:admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail:  env.FIREBASE_CLIENT_EMAIL,
        privateKey:  env.FIREBASE_PRIVATE_KEY
    })
    
})

export const firebaseMessaging = firebaseApp.messaging();