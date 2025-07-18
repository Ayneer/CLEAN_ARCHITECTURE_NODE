import { initializeApp, FirebaseApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore/lite";
import { envs } from "../../../config";
import { DataBase } from "../../interfaces/database_interface";

export class FirebaseDatabase implements DataBase {
  static app: FirebaseApp;
  static db: Firestore;

  async connect(options: {}): Promise<void> {
    const firebaseConfig = {
      apiKey: envs.FIREBASE_API_KEY,
      authDomain: envs.FIREBASE_AUTH_DOMAIN,
      projectId: envs.FIREBASE_PROJECT_ID,
      storageBucket: envs.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: envs.FIREBASE_MESSAGING_SENDER_ID,
      appId: envs.FIREBASE_APP_ID,
      measurementId: envs.FIREBASE_MEASUREMENT_ID,
    };

    // Initialize Firebase
    FirebaseDatabase.app = initializeApp(firebaseConfig);
    FirebaseDatabase.db = getFirestore(FirebaseDatabase.app);
  }
}
