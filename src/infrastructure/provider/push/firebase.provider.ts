import dotenv from 'dotenv';

dotenv.config({});

import admin from "firebase-admin";

const firebaseApp = admin.initializeApp({
    credential:admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail:  process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY
    })
    
})

export const firebaseMessaging = firebaseApp.messaging();