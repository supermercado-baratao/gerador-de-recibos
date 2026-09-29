import { type FirebaseOptions, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const env = import.meta.env

const firebaseConfig: FirebaseOptions = {
  apiKey: env.VITE_API_KEY,
  authDomain: env.VITE_AUTH_DOMAIN,
  projectId: env.VITE_PROJECT_ID,
  storageBucket: env.VITE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_MESSAGING_SENDER_ID,
  appId: env.VITE_APP_ID,
  measurementId: env.VITE_APP_MEASUREMENT_ID
}

export const app = initializeApp(firebaseConfig)

export const firestore = getFirestore(app)

export const auth = getAuth(app)

export const getUserPath = (collection: string) =>
  `users/${auth.currentUser!.uid}/${collection}`
