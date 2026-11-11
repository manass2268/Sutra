import express, { Response } from 'express';
import { verifyFirebaseToken, AuthRequest } from '../middleware/auth';
import { getFirestoreDB } from '../config/firebase';

const router = express.Router();

router.post('/sync-profile', verifyFirebaseToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || !user.uid) {
      res.status(401).json({ error: 'User not found in token' });
      return;
    }

    console.log(`🚀 [SYNC] Starting profile sync for UID: ${user.uid}`);

    const db = getFirestoreDB();
    const userRef = db.collection('users').doc(user.uid);

    await userRef.set({
      uid: user.uid,
      email: user.email || '',
      displayName: req.body.displayName || user.name || '',
      photoURL: user.picture || '',
      role: 'user',
      lastLogin: new Date().toISOString(),
    }, { merge: true });

    console.log(`✅ [SUCCESS] Profile saved to Firestore for: ${user.email}`);
    res.status(200).json({ message: 'User profile synced successfully' });

  } catch (error) {
    console.error('❌ Profile sync error:', error);
    res.status(500).json({ error: 'Internal server error during profile sync' });
  }
});

export default router;