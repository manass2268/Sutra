import * as admin from "firebase-admin";
import { VERSION } from "@sutra/shared";

// Initialize Firebase Admin without credentials for local Emulator support
admin.initializeApp();

console.log(`Functions initialized successfully. Using Shared Package Version: ${VERSION}`);