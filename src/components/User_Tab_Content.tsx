import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";

import { User as User_Local } from "@/types/User";
import { setCurrentUser, setCurrentEditedUser, setCurrentUserSubscriptions, setCurrentUserOrders } from "@/store/slices/user_slice";

// Firebase Client SDK
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getAuth, User, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, getDocs, DocumentData, Timestamp, collection, query, where } from "firebase/firestore";
import { useFirebase } from "@/components/Firebase_Context";

// Axios para requisições HTTP
import axios from "axios";

// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";

// Componentes
import User_Tab_General_Information from "./User_Tab_General_Information";
import User_Tab_Address_Information from "./User_Tab_Address_Information";
import User_Tab_Admin_Information from "./User_Tab_Admin_Information";
import User_Tab_Subscriptions from "./User_Tab_Subscriptions";
import User_Tab_Orders from "./User_Tab_Orders";

// Variáveis de Ambiente
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_SPECIAL_PROJECT_ID;

const NEXT_PUBLIC_PATH_API_GET_USER = process.env.NEXT_PUBLIC_PATH_API_GET_USER;
const NEXT_PUBLIC_PATH_API_CREATE_USER = process.env.NEXT_PUBLIC_PATH_API_CREATE_USER;
const NEXT_PUBLIC_PATH_API_UPDATE_USER = process.env.NEXT_PUBLIC_PATH_API_UPDATE_USER;

const NEXT_PUBLIC_PATH_API_GET_ORDER = process.env.NEXT_PUBLIC_PATH_API_GET_ORDER;
const NEXT_PUBLIC_PATH_API_CREATE_ORDER = process.env.NEXT_PUBLIC_PATH_API_CREATE_ORDER;
const NEXT_PUBLIC_PATH_API_UPDATE_ORDER = process.env.NEXT_PUBLIC_PATH_API_UPDATE_ORDER;

const NEXT_PUBLIC_PATH_API_GET_SUBSCRIPTION = process.env.NEXT_PUBLIC_PATH_API_GET_SUBSCRIPTION;

const businessTelephone = process.env.NEXT_PUBLIC_BUSINESS_MAIN_TELEPHONE;

if (!businessTelephone) {
    throw new Error("BUSINESS_MAIN_TELEPHONE environment variable is not defined");
}

const User_Tab_Content = () => {
    const dispatch = useDispatch();

    // Seletores do contexto Redux
    const [isCustomerLoading, setIsCustomerLoading] = useState(false);
    const customer = useSelector((state: RootState) => state.user.currentUser);
    const editedCustomer = useSelector((state: RootState) => state.user.editedCurrentUser);

    const setCurrentUserAction = (localUser: User_Local | null) => {
        dispatch(setCurrentUser(localUser));
    };

    const setEditedLocalUserAction = (localUser: User_Local | null) => {
        dispatch(setCurrentEditedUser(localUser));
    };

    // Função para descartar as alterações locais do usuário
    const discardLocalUserChanges = () => {
        if (customer) {
            setEditedLocalUserAction(customer);
        }
    };

    // Função para atualizar o usuário
    const updateUser = async () => {
        if (!editedCustomer) {
            console.error("No edited user data to update");
            return;
        }

        try {
            await axios.post(`${NEXT_PUBLIC_PATH_API_UPDATE_USER}`, editedCustomer);
            setCurrentUserAction(editedCustomer);
            // setUserTabNeedsUpdateAction(true);
            console.log("User updated successfully");
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    // Função para ordenar as propriedades de um objeto
    function sortObjectProperties(obj: { [key: string]: any }) {
        return Object.keys(obj)
            .sort()
            .reduce((result, key) => {
                if (key === "updated_at") {
                    // Skip the 'updated_at' property
                    return result;
                }
                if (key === "created_at") {
                    // Skip the 'updated_at' property
                    return result;
                }
                if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
                    result[key] = sortObjectProperties(obj[key]);
                } else {
                    result[key] = obj[key];
                }
                return result;
            }, {} as { [key: string]: any });
    }

    // Comparador de objetos que os transforma em strings para ver se há diferenças
    let isSomeLocalUserInfoEdited;

    if (customer && editedCustomer) {
        const sortedCustomer = sortObjectProperties(customer);
        const sortedEditedCustomer = sortObjectProperties(editedCustomer);
        // console.log(sortedCustomer);
        // console.log(sortedEditedCustomer);
        isSomeLocalUserInfoEdited = sortedCustomer && sortedEditedCustomer && JSON.stringify(sortedCustomer) !== JSON.stringify(sortedEditedCustomer);
    } else {
        isSomeLocalUserInfoEdited = false;
    }

    // Estados do campo de login
    const [loginWithEmailMode, setLoginWithEmailMode] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Funções de Autenticação
    // Login com Google
    const signInWithGoogle = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // console.log("User signed in:", result.user);
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    // Login com Email e Senha
    const signinWithEmail = async () => {
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // console.log("User signed up:", userCredential.user);

            if (userCredential.user) {
                // Set the displayName
                await updateProfile(userCredential.user, { displayName: "No name" });

                try {
                    // Fetch user data from get_user API
                    const response = await axios.get(`${NEXT_PUBLIC_PATH_API_GET_USER}`, { params: { id: userCredential.user.uid } });
                    // console.log("User data from API:", response.data);

                    if (response.status === 400) {
                        console.error("Missing required fields, cannot fetch user data");
                    }

                    if (response.data.message === "user-not-found") {
                        // console.log("User not found, creating a new user document in the database");
                        let new_user: User_Local = {
                            id: userCredential.user.uid,
                            name: userCredential.user.displayName ? userCredential.user.displayName : "Nenhum Nome Definido",
                            email: userCredential.user.email ? userCredential.user.email : "Nenhum Email Definido",
                            avatar_url: userCredential.user.photoURL ? userCredential.user.photoURL : "Nenhuma URL de Avatar Definida",

                            address: {
                                street: "Nenhuma Rua Definida",
                                number: "Nenhum Numero Definido",
                                complement: "Nenhum Complemento Definido",
                                city: "Nenhuma Cidade Definida",
                                state: "Nenhum Estado Definido",
                                zip: "Nenhum Código Postal Definido",
                            },

                            telephone: "Nenhum Telefone Definido",

                            isOwner: false,
                            isAdmin: false,
                            isEditor: false,
                            isSubscriber: false,

                            orders: [],
                            subscriptions: [],
                        };

                        await axios.post(`${NEXT_PUBLIC_PATH_API_CREATE_USER}`, new_user);
                        console.log("New user document created successfully");
                    }
                } catch (error) {
                    console.log("Error fetching user data:", error);
                }
            }
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    const login = async () => {
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // console.log("User logged in:", userCredential.user);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const logout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            setCurrentUserAction(null);
            // console.log("User signed out");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // Referência para o Scroll com Framer Motion
    const scroll_ref = useRef(null);
    const { scrollYProgress } = useScroll({ container: scroll_ref });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <>
            <m.div initial={{ x: -1000 }} animate={{ x: 0 }} exit={{ x: -1000 }} transition={{ duration: 0.5 }} className="User_Tab" key={"User_Tab"}>
                {/* Wrapper do Conteúdo da Aba do Usuário */}
                <div
                    className={isSomeLocalUserInfoEdited ? "UserTab_Content_Wrapper Extra_Bottom_Padding" : "UserTab_Content_Wrapper"}
                    ref={scroll_ref}
                >
                    <div className="User_Tab_Card_Wrapper">
                        <h1 className="User_Tab_Card_Title">Perfil do Cliente</h1>
                        {isCustomerLoading ? (
                            <div className="User_Tab_Loading">
                                <div className="User_Tab_Loading_Spinner">Carregando Usuário</div>
                            </div>
                        ) : (
                            <>
                                {customer && editedCustomer ? (
                                    <>
                                        <User_Tab_General_Information />
                                        <User_Tab_Admin_Information />
                                        <User_Tab_Address_Information />
                                        <User_Tab_Subscriptions />
                                        <User_Tab_Orders />

                                        {/* Botão de Logout */}
                                        <button className="Logout_Btn" onClick={logout}>
                                            <span className="material-icons Logout_Btn_Icon">logout</span>
                                            <p className="Logout_Btn_Text">Fazer Logout</p>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* Mensagem de que nenhum usuário está conectado */}
                                        <div id="user-tab-no-account-connected" className="User_No_Orders">
                                            <span className="material-icons">person_off</span>
                                            <p className="User_No_Orders_Text">Nenhuma conta conectada.</p>
                                        </div>

                                        {/* Interface para Login e Criação de Conta com Google e Com Email */}
                                        <div className="User_Login_Wrapper">
                                            {!loginWithEmailMode && (
                                                <div className="User_Login_Container">
                                                    <button onClick={signInWithGoogle} className="User_Google_Login_Btn">
                                                        <p className="User_Google_Login_Btn_Text">Faça login ou crie uma conta com o Google</p>
                                                        <span className="material-icons User_Google_Login_Btn_Icon">login</span>
                                                    </button>

                                                    <div className="User_Login_Container_Separator">
                                                        <div className="User_Login_Container_Separator_Line"></div>
                                                        <p className="User_Login_Container_Separator_Text">ou</p>
                                                        <div className="User_Login_Container_Separator_Line"></div>
                                                    </div>

                                                    <button
                                                        className="User_Google_Login_Btn"
                                                        onClick={() => {
                                                            setLoginWithEmailMode(true);
                                                        }}
                                                    >
                                                        <p className="User_Google_Login_Btn_Text">Faça login ou crie uma conta com apenas um email</p>
                                                        <span className="material-icons User_Google_Login_Btn_Icon">login</span>
                                                    </button>
                                                </div>
                                            )}

                                            {loginWithEmailMode && (
                                                <div className="User_Login_Container Email_Login_Container">
                                                    <div className="User_Login_Input_Container">
                                                        <input
                                                            className="User_Login_Input"
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            placeholder="Email"
                                                        />
                                                        <span className="material-icons User_Login_Input_Icon">email</span>
                                                    </div>

                                                    <div className="User_Login_Input_Container">
                                                        <input
                                                            className="User_Login_Input Login_Password"
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            placeholder="Senha"
                                                        />
                                                        <span className="material-icons User_Login_Input_Icon">lock</span>
                                                    </div>

                                                    <button className="User_Login_Btn" onClick={login}>
                                                        <p className="User_Login_Btn_Text">Login com este Email </p>
                                                        <span className="material-icons User_Login_Btn_Icon">login</span>
                                                    </button>
                                                    <button className="User_Login_Btn Register_Btn" onClick={signinWithEmail}>
                                                        <p className="User_Login_Btn_Text">Registre uma conta com este Email</p>{" "}
                                                        <span className="material-icons User_Login_Btn_Icon">person_add_alt</span>
                                                    </button>

                                                    <button
                                                        className="User_Login_Btn"
                                                        onClick={() => {
                                                            setLoginWithEmailMode(false);
                                                        }}
                                                    >
                                                        <p className="User_Login_Btn_Text">voltar</p>{" "}
                                                        <span className="material-icons User_Login_Btn_Icon">arrow_back</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Interface de Edição dos Dados do Usuário */}
                {isSomeLocalUserInfoEdited && (
                    <div className="User_Info_Edit_Control_Overlay">
                        <button className="User_Info_Edit_Control_Btn" onClick={discardLocalUserChanges}>
                            <span className="material-icons User_Info_Edit_Control_Btn_Icon">delete_forever</span>
                            <p className="User_Info_Edit_Control_Btn_Text">Descartar Alterações</p>
                        </button>
                        <button className="User_Info_Edit_Control_Btn" onClick={updateUser}>
                            <span className="material-icons User_Info_Edit_Control_Btn_Icon">update</span>
                            <p className="User_Info_Edit_Control_Btn_Text">Atualizar Informações</p>
                        </button>
                    </div>
                )}

                {/* Barra de Progresso de Scroll */}
                <div className="Progress_Bar_Container" key={"User_Tab_PB_Container"}>
                    <div className="Progress_Bar_Wrapper" key={"User_Tab_PB_Wrapper"}>
                        <m.div className="Progress_Bar" key={"User_Tab_PB"} style={{ scaleX }} />
                    </div>
                </div>
            </m.div>
        </>
    );
};

export default User_Tab_Content;
