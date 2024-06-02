import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";
import { Firestore, getFirestore, doc, setDoc, getDoc, getDocs, DocumentData, Timestamp, collection, query, where } from "firebase/firestore";

import { setUserIsAdmin } from "@/store/slices/user_slice";
import { useDispatch } from "react-redux";

const FIREBASE_CLIENT_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_API_KEY;
const FIREBASE_CLIENT_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_AUTH_DOMAIN;
const FIREBASE_CLIENT_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_PROJECT_ID;
const FIREBASE_CLIENT_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_STORAGE_BUCKET;
const FIREBASE_CLIENT_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_MESSAGING_SENDER_ID;
const FIREBASE_CLIENT_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_APP_ID;
const FIREBASE_CLIENT_MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_MEASUREMENT_ID;

if (
    !FIREBASE_CLIENT_PROJECT_ID ||
    !FIREBASE_CLIENT_API_KEY ||
    !FIREBASE_CLIENT_AUTH_DOMAIN ||
    !FIREBASE_CLIENT_STORAGE_BUCKET ||
    !FIREBASE_CLIENT_MESSAGING_SENDER_ID ||
    !FIREBASE_CLIENT_APP_ID ||
    !FIREBASE_CLIENT_MEASUREMENT_ID
) {
    throw new Error("One or more of the FIREBASE_CLIENT_ environment variables are not defined");
}

// Minha configuração do Firebase
const firebaseConfig = {
    apiKey: FIREBASE_CLIENT_API_KEY,
    authDomain: FIREBASE_CLIENT_AUTH_DOMAIN,
    projectId: FIREBASE_CLIENT_PROJECT_ID,
    storageBucket: FIREBASE_CLIENT_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_CLIENT_MESSAGING_SENDER_ID,
    appId: FIREBASE_CLIENT_APP_ID,
    measurementId: FIREBASE_CLIENT_MEASUREMENT_ID,
};

interface FirebaseProviderProps {
    children: ReactNode;
}

interface FirebaseContextValue {
    auth: Auth | null;
    firestore: Firestore | null;
    storage: FirebaseStorage | null;
}

// Criar um contexto para o Firebase
const FirebaseContext = createContext<FirebaseContextValue | null>(null);

// Criar um provedor de contexto para o Firebase
export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
    const dispatch = useDispatch();

    const [auth, setAuth] = useState<Auth | null>(null);
    const [firestore, setFirestore] = useState<Firestore | null>(null);
    const [storage, setStorage] = useState<FirebaseStorage | null>(null);

    const [firebaseInitialized, setFirebaseInitialized] = useState(false);

    // Função para buscar o documento do usuário no Firestore
    const fetchUserDoc = async (uid: string) => {
        if (!firestore) {
            console.log("Firestore is not initialized");
            return;
        }

        const projectID = FIREBASE_CLIENT_PROJECT_ID;
        const userDocRef = doc(firestore, `projects/${projectID}/users`, uid);

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            console.log("User Document Found! Document Data:", userDoc.data());

            if (userDoc.data().isAdmin === true) {
                console.log("User is an admin");
                setUserIsAdminAction(true);
            } else {
                console.log("User is not an admin");
                setUserIsAdminAction(false);
            }
        } else {
            console.log("User document not found");
            setUserIsAdminAction(false);
        }
    };

    const setUserIsAdminAction = (isAdmin: boolean) => {
        dispatch(setUserIsAdmin(isAdmin));
    };

    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const firestore = getFirestore(app);
        const auth = getAuth(app);
        const storage = getStorage(app);

        setAuth(auth);
        setFirestore(firestore);
        setStorage(storage);

        onAuthStateChanged(auth, (user) => {
            console.log("Auth state change detected:");
            if (user) {
                // User is signed in
                console.log("User is signed in: ", user);
                fetchUserDoc(user.uid);
            } else {
                // User is signed out
                console.log("User is not signed in");
                setUserIsAdminAction(false);
            }
        });

        /*
            console.log("Firebase App =>", app);
            console.log("Firebase Analytics =>", analytics);
            console.log("Firebase Firestore =>", firestore);
            console.log("Firebase Auth =>", auth);
            console.log("Firebase Storage =>", storage);
        */

        setFirebaseInitialized(true);
    }, []);

    if (!firebaseInitialized) {
        return <div>Carregando Firebase...</div>; // or your custom loading UI
    }

    return <FirebaseContext.Provider value={{ auth, firestore, storage }}>{children}</FirebaseContext.Provider>;
};

// Create a hook to use Firebase
export const useFirebase = () => {
    return useContext(FirebaseContext);
};
