
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBkVr6c2v0Uafhl4Hh85JknB6F4hgUK6p8',
  authDomain: 'saeesh-be117.firebaseapp.com',
  projectId: 'saeesh-be117',
  storageBucket: 'saeesh-be117.firebasestorage.app',
  messagingSenderId: '985551183227',
  appId: '1:985551183227:web:ba31f956b60ed5142231de',
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
