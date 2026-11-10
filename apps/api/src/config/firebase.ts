import admin from 'firebase-admin';
export const initFirebaseAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin (Auth & Firestore) Initialized');
  }
};
// Exporting getter functions so they are only called AFTER initialization
export const getFirestoreDB = () => admin.firestore();
export const getFirebaseAuth = () => admin.auth();
export default admin;