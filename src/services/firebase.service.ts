import {initializeApp, FirebaseOptions} from "firebase/app";
import {getAuth} from "firebase/auth";


function initializeFirebase() {
    const firebaseConfig = {
        apiKey: `${import.meta.env.VITE_API_KEY}`,
        authDomain: `${import.meta.env.VITE_AUTH_DOMAIN}`,
        projectId: `${import.meta.env.VITE_PROJECT_ID}`,
        storageBucket: `${import.meta.env.VITE_STORAGE_BUCKET}`,
        messagingSenderId: `${import.meta.env.VITE_MESSAGING_SENDER_ID}`,
        appId: `${import.meta.env.VITE_APP_ID}`,
        measurementId: `${import.meta.env.VITE_MEASUREMENT_ID}`
    };

    try {
        const firebaseApp = initializeApp(firebaseConfig as FirebaseOptions);
        const auth = getAuth(firebaseApp);
        return {firebaseApp, auth};
    } catch (error) {
        console.error(`Error with firebase configuration cause ${error}`)
    }
}


export const getFirebase = initializeFirebase();