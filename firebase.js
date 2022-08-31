import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyCOP0o67J3bTmOSykg9p-rdgenAjIkQ9U4",
    authDomain: "whatsapp-clone-e1eeb.firebaseapp.com",
    projectId: "whatsapp-clone-e1eeb",
    storageBucket: "whatsapp-clone-e1eeb.appspot.com",
    messagingSenderId: "131598715977",
    appId: "1:131598715977:web:3febfed07deaf3228b4398"
};

// const app = !firebase.apps.length
//     ? firebase.initializeApp(firebaseConfig)
//     : firebase.app()

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { db, auth, provider }