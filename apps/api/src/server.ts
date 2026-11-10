console.log("1. Server file executing...");
import dotenv from 'dotenv';
dotenv.config();
console.log("2. Environment variables loaded");

import app from './app';
console.log("3. App imported");

import { initFirebaseAdmin } from './config/firebase';
console.log("4. Firebase config imported");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("5. startServer function called");
  try {
    initFirebaseAdmin();
    console.log("6. Firebase Admin initialized");
    
    app.listen(PORT, () => {
      console.log(`🚀 SUTRAA API Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ ERROR STARTING SERVER:", error);
  }
};

startServer();