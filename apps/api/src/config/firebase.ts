import admin from 'firebase-admin';

export const initFirebaseAdmin = () => {
  if (!admin.apps.length) {
    
    const safeProjectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const safeClientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
    const safePrivateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '').trim()
      : undefined;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: safeProjectId,
        clientEmail: safeClientEmail,
        privateKey: safePrivateKey,
      }),
     
      projectId: safeProjectId, 
    });
    console.log(`Firebase Admin Initialized for project: ${safeProjectId}`);
  }
};

// Exporting getter functions so they are only called AFTER initialization
export const getFirestoreDB = () => admin.firestore();
export const getFirebaseAuth = () => admin.auth();

export default admin;