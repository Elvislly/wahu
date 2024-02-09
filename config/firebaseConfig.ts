// import firebase from 'firebase/compat/app'
// import 'firebase/compat/auth'
// import 'firebase/compat/firestore'

// const firebaseConfig = {
//   apiKey: "AIzaSyBU3pzoCC-aybjR6Hvwi3V_-eNpYahplWg",
//   authDomain: "wahu-auth.firebaseapp.com",
//   projectId: "wahu-auth",
//   storageBucket: "wahu-auth.appspot.com",
//   messagingSenderId: "49078308569",
//   appId: "1:49078308569:web:5b4a0a3ac3e07e74c6f8c8",
//   measurementId: "G-6NF590Q643"
// }

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig)
// }

// export  const WebFirebase = firebase

import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWZWpLVvs_DL7BFH1gBL3v3RieriL0V7U",
  authDomain: "wahu-signup.firebaseapp.com",
  projectId: "wahu-signup",
  storageBucket: "wahu-signup.appspot.com",
  messagingSenderId: "135083071812",
  appId: "1:135083071812:web:929abf86e1a3fbfbad5f11",
  measurementId: "G-0S7TBVY4N9"
}


// / Check if Firebase app is already initialized
if (!firebase.apps.length) {
  // Initialize Firebase app
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase authentication
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const WebAuth = auth;
export const WebFirebase = firebase;