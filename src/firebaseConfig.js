import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1fNyAKqXHUbPUwRtuS9pWtqyN-tCxYQI",
  authDomain: "goofies-website.firebaseapp.com",
  projectId: "goofies-website",
  storageBucket: "goofies-website.appspot.com",
  messagingSenderId: "857266723371",
  appId: "1:857266723371:web:442924c2ef2b3f7748286e",
  measurementId: "G-3BQG70GF2H",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
