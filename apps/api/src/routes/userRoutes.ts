import express, { Response } from 'express';
import { verifyFirebaseToken, AuthRequest } from '../middleware/auth';
import { getFirestoreDB } from '../config/firebase';

const router = express.Router();


router.post('/sync-profile', verifyFirebaseToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'User not found in token' });
      return;
    }

    const db = getFirestoreDB();
    const userRef = db.collection('users').doc(user.uid);


    const doc = await userRef.get();

    if (!doc.exists) {

      await userRef.set({
        uid: user.uid,
        email: user.email,
        displayName: req.body.displayName || user.name || '',
        photoURL: user.picture || '',
        role: 'user',
        lastLogin: new Date().toISOString(),
      });
      res.status(201).json({ message: 'User profile created in Firestore successfully' });
    } else {

      await userRef.update({ lastLogin: new Date().toISOString() });
      res.status(200).json({ message: 'User profile synced successfully' });
    }
  } catch (error) {
    console.error('Profile sync error:', error);
    res.status(500).json({ error: 'Internal server error during profile sync' });
  }
});

export default router;