// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaPu5Vkzt4iiqmMPiIIqRFn0eITYvJmCI",
  authDomain: "weather-app-ff56d.firebaseapp.com",
  projectId: "weather-app-ff56d",
  storageBucket: "weather-app-ff56d.appspot.com",
  messagingSenderId: "224067103245",
  appId: "1:224067103245:web:3b56f116f80bf1de1fc344",
  measurementId: "G-QEPZZWSXC9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };