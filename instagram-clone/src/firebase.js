import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBlGfvMT8fI1u8hyP2ZoCtdGj0jC4IuITI",
  authDomain: "instagram-clone-a9e94.firebaseapp.com",
  projectId: "instagram-clone-a9e94",
  storageBucket: "instagram-clone-a9e94.appspot.com",
  messagingSenderId: "370251323836",
  appId: "1:370251323836:web:093931ed6e78fca899f3b9",
  measurementId: "G-L8GNJC3WS5"
})
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export {db,storage,auth}




