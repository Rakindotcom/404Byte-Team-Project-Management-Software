// Firebase Configuration for Team404 Project Management
const firebaseConfig = {
    apiKey: "AIzaSyCinD2ZXkaWirNO-469wn-K3QBAaMTUSuk",
    authDomain: "team404byte.firebaseapp.com",
    projectId: "team404byte",
    storageBucket: "team404byte.firebasestorage.app",
    messagingSenderId: "369648165420",
    appId: "1:369648165420:web:f84a18b3fd1d290f2d6789"
};

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
