import admin from 'firebase-admin';

export const initFirebaseAdmin = () => {
  if (!admin.apps.length) {
    const safeClientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
    const safePrivateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '').trim()
      : undefined;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "sutra-1bdf3", 
        clientEmail: safeClientEmail,
        privateKey: safePrivateKey,
      }),
      projectId: "sutra-1bdf3", 
    });
    console.log('Firebase Admin Initialized for project: sutra-1bdf3');
  }
};


export const getFirestoreDB = () => {
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
};

export const getFirebaseAuth = () => admin.auth();

export default admin;