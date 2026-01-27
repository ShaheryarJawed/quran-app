// FIREBASE CONFIGURATION (Managed by User Keys)
const firebaseConfig = {
    apiKey: "AIzaSyD49dSw-VOSy3VudguEE23xGIIC3tqtx9Q",
    authDomain: "deensphere-d9ce6.firebaseapp.com",
    projectId: "deensphere-d9ce6",
    storageBucket: "deensphere-d9ce6.firebasestorage.app",
    messagingSenderId: "598560509692",
    appId: "1:598560509692:web:ff38f4e4858f2a4c9cd179",
    measurementId: "G-68JE8B3BER"
};

// Initialize Firebase (Compat Mode)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    // console.log("Firebase Initialized");
} else {
    // console.warn("Firebase SDK not present (Safe for index.html, required for auth.html)");
}
