// Firebase Admin SDK
import admin, { ServiceAccount } from "firebase-admin";

if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error("The FIREBASE_PROJECT_ID environment variable is not defined");
}

if (!process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error("The FIREBASE_CLIENT_EMAIL environment variable is not defined");
}

if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("The FIREBASE_PRIVATE_KEY environment variable is not defined");
}

if (!process.env.FIREBASE_PRAGMATA_PROJECT_ID) {
    throw new Error("The FIREBASE_PRAGMATA_PROJECT_ID environment variable is not defined");
}

const serviceAccount: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://pragmatas-dev.firebaseio.com",
        storageBucket: "pragmatas-dev.appspot.com",
    });
}

// Get Auth and Firestore instances
const auth = admin.auth();
const firestore = admin.firestore();
const storage = admin.storage();

export { auth, firestore, storage };
