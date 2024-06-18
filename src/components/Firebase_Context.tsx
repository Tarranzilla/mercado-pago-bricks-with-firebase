import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

import axios from "axios";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";
import { Firestore, getFirestore, doc, setDoc, getDoc, getDocs, DocumentData, Timestamp, collection, query, where } from "firebase/firestore";

import {
    setFirebaseUser,
    setCurrentUser,
    setCurrentEditedUser,
    setUserIsAdmin,
    setCurrentUserSubscriptions,
    setCurrentUserOrders,
} from "@/store/slices/user_slice";
import { useDispatch } from "react-redux";

import { User as User_Local } from "@/types/User";
import { User_Firebase } from "@/store/slices/user_slice";
import { Subscription } from "@/types/Subscription";
import { Order } from "@/types/Order";

// Variáveis de ambiente para o Firebase Client Side
const FIREBASE_CLIENT_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_API_KEY;
const FIREBASE_CLIENT_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_AUTH_DOMAIN;
const FIREBASE_CLIENT_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_PROJECT_ID;
const FIREBASE_CLIENT_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_STORAGE_BUCKET;
const FIREBASE_CLIENT_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_MESSAGING_SENDER_ID;
const FIREBASE_CLIENT_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_APP_ID;
const FIREBASE_CLIENT_MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_MEASUREMENT_ID;

// Variáveis de ambiente para o Firebase Server Side
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_SPECIAL_PROJECT_ID;

const NEXT_PUBLIC_PATH_API_GET_USER = process.env.NEXT_PUBLIC_PATH_API_GET_USER;
const NEXT_PUBLIC_PATH_API_CREATE_USER = process.env.NEXT_PUBLIC_PATH_API_CREATE_USER;
const NEXT_PUBLIC_PATH_API_UPDATE_USER = process.env.NEXT_PUBLIC_PATH_API_UPDATE_USER;

const NEXT_PUBLIC_PATH_API_GET_SUBSCRIPTION = process.env.NEXT_PUBLIC_PATH_API_GET_SUBSCRIPTION;

const NEXT_PUBLIC_PATH_API_GET_ORDER = process.env.NEXT_PUBLIC_PATH_API_GET_ORDER;

if (
    !FIREBASE_CLIENT_PROJECT_ID ||
    !FIREBASE_CLIENT_API_KEY ||
    !FIREBASE_CLIENT_AUTH_DOMAIN ||
    !FIREBASE_CLIENT_STORAGE_BUCKET ||
    !FIREBASE_CLIENT_MESSAGING_SENDER_ID ||
    !FIREBASE_CLIENT_APP_ID ||
    !FIREBASE_CLIENT_MEASUREMENT_ID ||
    !FIREBASE_PROJECT_ID ||
    !NEXT_PUBLIC_PATH_API_GET_USER ||
    !NEXT_PUBLIC_PATH_API_CREATE_USER ||
    !NEXT_PUBLIC_PATH_API_UPDATE_USER ||
    !NEXT_PUBLIC_PATH_API_GET_ORDER
) {
    throw new Error("One or more of the API PATHS environment variables are not defined");
}

// Minha configuração do Firebase para o cliente
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

    // Função para buscar o documento do usuário no Firestore pelo Client Side
    const fetchUserDocClientSide = async (uid: string) => {
        if (!firestore) {
            // console.log("Firestore is not initialized");
            return;
        }

        const projectID = FIREBASE_CLIENT_PROJECT_ID;
        const userDocRef = doc(firestore, `projects/${projectID}/users`, uid);

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            // console.log("User Document Found! Document Data:", userDoc.data());

            if (userDoc.data().isAdmin === true) {
                // console.log("User is an admin");
                setUserIsAdminAction(true);
            } else {
                // console.log("User is not an admin");
                setUserIsAdminAction(false);
            }
        } else {
            // console.log("User document not found");
            setUserIsAdminAction(false);
        }
    };

    // Função para buscar o documento do usuário no Firestore pelo Server Side e atualizar o estado do Redux
    const fetchOrCreateAndSetUserDocServerSide = async (firebase_user: User_Firebase) => {
        try {
            // Fetch user data from get_user API
            // console.log("Context Fetching Firebase User data from API...");
            const response = await axios.get(`${NEXT_PUBLIC_PATH_API_GET_USER}`, { params: { id: firebase_user.id } });
            // console.log("Context Fetching User Response => ", response.data);

            if (response.status === 400) {
                console.log("Missing required fields, cannot fetch user data");
                return;
            }

            if (response.data.message === "user-not-found") {
                // console.log("Firebase User not found");

                let new_user: User_Local = {
                    id: firebase_user.id,
                    name: firebase_user.display_name ? firebase_user.display_name : "Nenhum Nome Definido",
                    email: firebase_user.email ? firebase_user.email : "Nenhum Email Definido",
                    avatar_url: firebase_user.avatar_url ? firebase_user.avatar_url : "Nenhuma URL de Avatar Definida",

                    address: {
                        street: "Nenhuma Rua Definida",
                        number: "Nenhum Número Definido",
                        complement: "Nenhum Complemento Definido",
                        city: "Nenhuma Cidade Definida",
                        state: "Nenhum Estado Definido",
                        zip: "Nenhum Código Postal Definido",
                    },

                    telephone: "Nenhum Número de Telefone Definido",

                    isOwner: false,
                    isAdmin: false,
                    isEditor: false,
                    isSubscriber: false,

                    orders: [],
                    subscriptions: [],
                };

                const newUserResponse = await axios.post(`${NEXT_PUBLIC_PATH_API_CREATE_USER}`, new_user);
                // console.log("Response:", newUserResponse);

                if (newUserResponse.status === 200) {
                    console.log("New user document created successfully");

                    setCurrentUserAction(new_user);
                    setCurrentEditedUserAction(new_user);
                    fetchSubscriptionsForUser(new_user);
                    fetchOrdersForUser(new_user);

                    // Fetch user data here
                } else {
                    console.log(`Failed to create new user document, status code: ${newUserResponse.status}`);
                }

                return;
            } else {
                // console.log("Firebase User found, setting the current user in Redux");
                setCurrentUserAction(response.data as User_Local);
                setCurrentEditedUserAction(response.data as User_Local);
                fetchSubscriptionsForUser(response.data as User_Local);
                fetchOrdersForUser(response.data as User_Local);

                if (response.data.isAdmin) {
                    // console.log("User is an admin");
                    setUserIsAdminAction(true);
                } else {
                    // console.log("User is not an admin");
                    setUserIsAdminAction(false);
                }
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    };
    //
    const setFirebaseUserAction = (user: User_Firebase | null) => {
        dispatch(setFirebaseUser(user));
    };

    // Função para atualizar o estado do Redux com os dados do usuário
    const setCurrentUserAction = (user: User_Local | null) => {
        dispatch(setCurrentUser(user));
    };

    // Função para atualizar o estado do Redux com os dados do usuário que está sendo editado
    const setCurrentEditedUserAction = (user: User_Local | null) => {
        dispatch(setCurrentEditedUser(user));
    };

    // Função para atualizar o estado do Redux com as permissões de administrador do usuário
    const setUserIsAdminAction = (isAdmin: boolean) => {
        dispatch(setUserIsAdmin(isAdmin));
    };

    // Função para atualizar o estado do Redux com os dados das assinaturas do usuário
    const setCurrentUserSubscriptionsAction = (subscriptions: Subscription[]) => {
        dispatch(setCurrentUserSubscriptions(subscriptions));
    };

    // Função para buscar o documento de assinatura no Firestore
    const fetchSubscriptionDoc = async (subscription_id: string): Promise<Subscription | undefined> => {
        try {
            // Fetch user data from get_user API
            const response = await axios.get(`${NEXT_PUBLIC_PATH_API_GET_SUBSCRIPTION}`, { params: { subscription_id: subscription_id } });
            // console.log("User data from API:", response.data);

            if (response.status === 400) {
                console.error("Missing required fields, cannot fetch order data");
            }

            if (response.data.message === "subscription-not-found") {
                console.log("Subscription not found");
            }

            if (response.data) {
                return response.data as Subscription;
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    };

    // Função para buscar todos os documentos de assinatura de um determinado usuário no Firestore
    const fetchSubscriptionsForUser = async (user: User_Local): Promise<Subscription[] | undefined> => {
        const user_subscriptions = user.subscriptions;
        // console.log("User Subscriptions:", user_subscriptions);

        if (user_subscriptions.length < 1) {
            console.log("Usuário nao possui Assinaturas.");
            return [];
        }

        try {
            const subscriptions: (Subscription | undefined)[] = await Promise.all(
                user_subscriptions.map(async (subscription_id) => {
                    const subscription = await fetchSubscriptionDoc(subscription_id);
                    if (subscription) {
                        // console.log(subscription);
                        return subscription;
                    }
                })
            );

            // Filter out any undefined values
            const validSubscriptions: Subscription[] = subscriptions.filter(
                (subscription): subscription is Subscription => subscription !== undefined
            );

            // Set the subscription list with the valid subscriptions
            setCurrentUserSubscriptionsAction(validSubscriptions);

            return validSubscriptions;
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            return undefined;
        }
    };

    const setCurrentUserOrdersAction = (orders: Order[]) => {
        dispatch(setCurrentUserOrders(orders));
    };

    // Função para buscar o documento do pedido no Firestore
    const fetchOrderDoc = async (order_id: string): Promise<Order | undefined> => {
        try {
            // Fetch user data from get_user API
            const response = await axios.get(`${NEXT_PUBLIC_PATH_API_GET_ORDER}`, { params: { order_id: order_id } });
            // console.log("User data from API:", response.data);

            if (response.status === 400) {
                console.error("Missing required fields, cannot fetch order data");
            }

            if (response.data.message === "order-not-found") {
                console.log("Order not found");
            }

            if (response.data) {
                return response.data as Order;
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    };

    // Função para buscar todos os pedidos para o usuário - O usuário deve ter uma lista de referências externas de pedidos e então buscamos no banco de dados
    const fetchOrdersForUser = async (user: User_Local): Promise<Order[] | undefined> => {
        const user_orders = user.orders;
        // console.log("User Orders:", user_orders);

        if (user_orders.length < 1) {
            console.log("Usuário nao possui pedidos.");
            return [];
        }

        try {
            const orders: (Order | undefined)[] = await Promise.all(
                user_orders.map(async (order_id) => {
                    const order = await fetchOrderDoc(order_id);
                    if (order) {
                        // console.log(order);
                        return order;
                    }
                })
            );

            // Filter out any undefined values
            const validOrders: Order[] = orders.filter((order): order is Order => order !== undefined);

            // Set the order list with the valid orders
            setCurrentUserOrdersAction(validOrders);

            return validOrders;
        } catch (error) {
            console.error("Error fetching orders:", error);
            return undefined;
        }
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

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // console.log("Auth state change detected:", auth);
            // console.log("Current auth user:", auth.currentUser);
            if (user) {
                // User is signed in
                // console.log("User is signed in: ", user);

                const { uid, email, displayName, photoURL } = user;

                const firebase_user: User_Firebase = {
                    id: uid,
                    email: email || "Nenhum Email Definido",
                    display_name: displayName || "Nenhum Nome Definido",
                    avatar_url: photoURL || "Nenhuma Imagem Definida",
                };

                // console.log("Firebase User =>", firebase_user);

                setFirebaseUserAction(firebase_user);
                fetchOrCreateAndSetUserDocServerSide(firebase_user);
            } else {
                // User is signed out
                // console.log("User is not signed in");
                setFirebaseUserAction(null);
                setCurrentUserAction(null);
                setCurrentEditedUserAction(null);
                setUserIsAdminAction(false);
                setCurrentUserSubscriptionsAction([]);
                setCurrentUserOrdersAction([]);
            }
        });

        /*  Logs para verificar se o Firebase foi inicializado corretamente
            console.log("Firebase App =>", app);
            console.log("Firebase Analytics =>", analytics);
            console.log("Firebase Firestore =>", firestore);
            console.log("Firebase Auth =>", auth);
            console.log("Firebase Storage =>", storage);
        */

        setFirebaseInitialized(true);

        // Return the unsubscribe function to clean up on unmount
        return unsubscribe;
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
