import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";

// Axios para requisições HTTP
import axios from "axios";

// Framer motion para animações
import { motion as m, AnimatePresence } from "framer-motion";

// Funções Utilitárias
import { generate_whatsapp_url_for_more_order_info } from "@/util/WhatsApp";

// Firebase Client SDK
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getAuth, User, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, getDocs, DocumentData, Timestamp, collection, query, where } from "firebase/firestore";
import { useFirebase } from "@/components/Firebase_Context";

// import { useSimpleTranslation } from "@/international/useSimpleTranslation";

// Gerenciamento de Estado com Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
// import type { CheckoutOrder } from "@/store/slices/cart_slice";
import { setUserTabNeedsUpdate } from "@/store/slices/interface_slice";

// import { Order } from "@/types/Order";

// Variáveis de Ambiente
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_SPECIAL_PROJECT_ID;

const NEXT_PUBLIC_PATH_API_GET_USER = process.env.NEXT_PUBLIC_PATH_API_GET_USER;
const NEXT_PUBLIC_PATH_API_CREATE_USER = process.env.NEXT_PUBLIC_PATH_API_CREATE_USER;
const NEXT_PUBLIC_PATH_API_UPDATE_USER = process.env.NEXT_PUBLIC_PATH_API_UPDATE_USER;

const NEXT_PUBLIC_PATH_API_GET_ORDER = process.env.NEXT_PUBLIC_PATH_API_GET_ORDER;
const NEXT_PUBLIC_PATH_API_CREATE_ORDER = process.env.NEXT_PUBLIC_PATH_API_CREATE_ORDER;
const NEXT_PUBLIC_PATH_API_UPDATE_ORDER = process.env.NEXT_PUBLIC_PATH_API_UPDATE_ORDER;

const businessTelephone = process.env.NEXT_PUBLIC_BUSINESS_MAIN_TELEPHONE;

if (!businessTelephone) {
    throw new Error("BUSINESS_MAIN_TELEPHONE environment variable is not defined");
}

// Tipos de Dados
import { Order } from "@/types/Order";
import { Address } from "@/types/Address";
import { User as User_Local } from "@/types/User";

// Propriedades do Componente de Pedido
export type OrderItemProps = {
    order: Order;
    index: number;
};

// Componente de Pedido
export const OrderItem: React.FC<OrderItemProps> = ({ order, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="User_Order_Item" key={index}>
            <div className="Order_Item_Text">
                <h3 className="User_Info_Label">Pedido Nº</h3>
                <h3 className="User_Order_Number">#{order.order_external_reference}</h3>

                <p className="User_Info_Detail User_Order_Date">
                    {new Intl.DateTimeFormat("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    }).format(order.order_date.toDate())}
                </p>

                <div className="User_Order_Price">
                    <h4>Valor Total: </h4>
                    <p>
                        R$
                        {order.order_items.reduce((total, order_item) => total + order_item.product.price * order_item.quantity, 0)}
                        ,00
                    </p>
                </div>

                <p className="User_Order_Status">
                    {Object.values(order.status).every((status) => status === false) && (
                        <>
                            <span className="material-icons">hourglass_bottom</span>
                            Aguardando Aprovação
                        </>
                    )}
                    {order.status.confirmed_by_admin === true && (
                        <>
                            <span className="material-icons">hourglass_bottom</span>
                            Confirmado
                        </>
                    )}
                    {order.status.waiting_payment === true && (
                        <>
                            <span className="material-icons">request_quote</span> Aguardando Pagamento
                        </>
                    )}
                    {order.status.in_production === true && (
                        <>
                            <span className="material-icons">category</span> Em Produção
                        </>
                    )}
                    {order.status.waiting_for_retrieval === true && (
                        <>
                            <span className="material-icons">store</span> Aguardando Retirada
                        </>
                    )}
                    {order.status.retrieved === true && (
                        <>
                            <span className="material-icons">markunread_mailbox</span> Retirado no Balcão
                        </>
                    )}
                    {order.status.waiting_for_delivery === true && (
                        <>
                            <span className="material-icons">conveyor_belt</span> Aguardando Entrega
                        </>
                    )}
                    {order.status.delivered === true && (
                        <>
                            <span className="material-icons">markunread_mailbox</span> Entregue
                        </>
                    )}
                    {order.status.cancelled === true && (
                        <>
                            <span className="material-icons">do_not_disturb</span> Cancelado
                        </>
                    )}
                </p>

                <a
                    href={generate_whatsapp_url_for_more_order_info(order.order_external_reference, businessTelephone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="User_Order_Status User_Order_Status_Call_Btn"
                >
                    <span className="material-icons">support_agent</span> Solicitar Atendimento
                </a>
            </div>

            <span
                className={isExpanded ? "material-icons Order_Expand_Btn Active" : "material-icons Order_Expand_Btn"}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                expand_more
            </span>

            <AnimatePresence>
                {isExpanded && (
                    <>
                        <m.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2, ease: [0.43, 0.13, 0.23, 0.96], when: "beforeChildren" }}
                            className="User_Order_Extra_Info"
                        >
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                                className="User_Order_Product_List"
                            >
                                {order.order_items.map((order_item, index) => {
                                    return (
                                        <div key={index} className="User_Order_Product">
                                            <p className="User_Order_Product_Title">{order_item.product.title}</p>
                                            <p className="User_Order_Product_Qtty">{order_item.quantity}x</p>
                                            <p className="User_Order_Product_Price">R${order_item.product.price},00</p>
                                        </div>
                                    );
                                })}
                            </m.div>

                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                                className="User_Order_Shipping_Option"
                            >
                                <h4 className="User_Order_Shipping_Option_Title">Método de Recebimento:</h4>
                                <div className="User_Order_Shipping_Option_Type">
                                    {order.shipping_option === "Entrega" && <span className="material-icons">local_shipping</span>}

                                    {order.shipping_option === "Retirada" && <span className="material-icons">store</span>}
                                    {order.shipping_option}
                                </div>
                            </m.div>
                        </m.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

/*  À FAZER

    Criar contexto do Carrinho
    Descobrir o que era o Checkout Order e Como se Relaciona com Order
    Criar contexto de interface e inserir o user tab needs update nela (?)

*/

// Componente de Aba de Usuário
export default function UserTab() {
    const firebase = useFirebase();
    const dispatch = useDispatch();

    if (!firebase) {
        throw new Error("Firebase context is not available");
    }

    const isUserTabOpen = useSelector((state: RootState) => state.interface.isUserTabOpen);
    const userTabNeedsUpdate = useSelector((state: RootState) => state.interface.userTabNeedsUpdate);

    const userTabNeedsNoUpdateAction = () => {
        dispatch(setUserTabNeedsUpdate(false));
    };

    // Estados do campo de login
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estados do usuário, user é o usuário padrão do Google e localUser é o usuário do nosso banco de dados
    const [user, setUser] = useState<User | null>(null);
    const [localUser, setLocalUser] = useState<User_Local | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Estado para ver mais do que 3 pedidos
    const [seeMore, setSeeMore] = useState(false);

    // Estado para ver os pedidos do usuário
    const [orderList, setOrderList] = useState<Order[]>([]);
    const sortedOrders = orderList.sort((a, b) => b.order_date.toMillis() - a.order_date.toMillis());
    const displayedOrders = seeMore ? sortedOrders : sortedOrders.slice(0, 3);
    const noOrders = orderList.length === 0;

    // Estados para a atualização de dados do usuário
    const [address, setAddress] = useState<Address>({
        city: "",
        street: "",
        number: "",
        complement: "",
        state: "",
        zip: "",
    });
    const [editedAddress, setEditedAddress] = useState<Address>(address);
    const [isEditing, setIsEditing] = useState({
        city: false,
        street: false,
        number: false,
        complement: false,
        state: false,
        zip: false,
    });
    const isSomeAddressEdited = Object.entries(editedAddress).some(([key, value]) => address[key] !== value);

    const handleAddressChange = (field: string, value: string) => {
        setEditedAddress({ ...editedAddress, [field]: value });
    };

    const updateAddress = async () => {
        if (!user) {
            console.log("User is not logged in, operation cannot proceed.");
            return;
        }

        // Save the new address to Firestore here
        const db = getFirestore();
        const projectUID = FIREBASE_PROJECT_ID; // Replace with your project's UID
        const userDocRef = doc(db, `projects/${projectUID}/users`, user.uid);

        await setDoc(
            userDocRef,
            {
                address: editedAddress,
            },
            { merge: true }
        );

        // Then set the new address and exit edit mode
        setAddress(editedAddress);
    };

    const discardChanges = () => {
        setIsEditing({
            city: false,
            street: false,
            number: false,
            complement: false,
            state: false,
            zip: false,
        });
        setEditedAddress(address);
    };

    // Funções de Autenticação
    const signIn = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("User signed in:", result.user);

            if (result.user) {
                try {
                    // Fetch user data from get_user API
                    const response = await axios.get(`${NEXT_PUBLIC_PATH_API_GET_USER}`, { params: { id: result.user.uid } });
                    // console.log("User data from API:", response.data);

                    if (response.status === 400) {
                        console.error("Missing required fields, cannot fetch user data");
                    }

                    if (response.data.message === "user-not-found") {
                        console.log("User not found, creating a new user document in the database");
                        let new_user: User_Local = {
                            id: result.user.uid,
                            name: result.user.displayName ? result.user.displayName : "No name",
                            email: result.user.email ? result.user.email : "No email",
                            avatar_url: result.user.photoURL ? result.user.photoURL : "No avatar URL",

                            address: {
                                street: "No street",
                                number: "No number",
                                complement: "No complement",
                                city: "No city",
                                state: "No state",
                                zip: "No zip code",
                            },

                            telephone: "No telephone number",

                            isOwner: false,
                            isAdmin: false,
                            isEditor: false,
                            isSubscriber: false,

                            orders: [],
                        };

                        await axios.post(`${NEXT_PUBLIC_PATH_API_CREATE_USER}`, new_user);
                        console.log("New user document created successfully");
                    }
                } catch (error) {
                    console.log("Error fetching user data:", error);
                }
            }
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const signUp = async () => {
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up:", userCredential.user);

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
                        console.log("User not found, creating a new user document in the database");
                        let new_user: User_Local = {
                            id: userCredential.user.uid,
                            name: userCredential.user.displayName ? userCredential.user.displayName : "No name",
                            email: userCredential.user.email ? userCredential.user.email : "No email",
                            avatar_url: userCredential.user.photoURL ? userCredential.user.photoURL : "No avatar URL",

                            address: {
                                street: "No street",
                                number: "No number",
                                complement: "No complement",
                                city: "No city",
                                state: "No state",
                                zip: "No zip code",
                            },

                            telephone: "No telephone number",

                            isOwner: false,
                            isAdmin: false,
                            isEditor: false,
                            isSubscriber: false,

                            orders: [],
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
            console.log("User logged in:", userCredential.user);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const logout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            console.log("User signed out");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // Função para buscar o documento do usuário no Firestore
    const fetchUserDoc = async (uid: string) => {
        try {
            // Fetch user data from get_user API
            const response = await axios.get(`${NEXT_PUBLIC_PATH_API_GET_USER}`, { params: { id: uid } });
            // console.log("User data from API:", response.data);

            if (response.status === 400) {
                console.error("Missing required fields, cannot fetch user data");
            }

            if (response.data.message === "user-not-found") {
                console.log("User not found");
            }

            if (response.data) {
                setLocalUser(response.data as User_Local);
                console.log("Local User: ", response.data);
                setAddress(response.data.address);
                setEditedAddress(response.data.address);

                if (response.data.isAdmin) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
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
    const fetchOrdersForUser = async (): Promise<Order[] | undefined> => {
        const user_orders = localUser?.orders;

        if (!user_orders) {
            console.log("Usuário nao possui pedidos.");
            return [];
        }

        let orders: Order[] = [];

        user_orders.forEach(async (order_id) => {
            const order = await fetchOrderDoc(order_id);
            if (order) {
                orders.push(order);
                setOrderList([...orderList, order]);
            }
        });

        return orders;
    };

    // Função para tradução | Ainda nao aplicada neste projeto
    // const t = useSimpleTranslation();

    // Efeito que ocorre uma vez após o componente carregar: Um observador de estado de autenticação é criado e o usuário e seus dados são atualizados
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                fetchUserDoc(user.uid);
                fetchOrdersForUser();
            }
        });

        // Função de limpeza que é chamada quando o componente é desmontado
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user && userTabNeedsUpdate === true) {
            console.log("Fetching New Orders for the User:", user.uid);
            fetchOrdersForUser();
            userTabNeedsNoUpdateAction();
        }
    }, [user, userTabNeedsUpdate]);

    return (
        <>
            <AnimatePresence>
                {isUserTabOpen && (
                    <m.div initial={{ x: -1000 }} animate={{ x: 0 }} exit={{ x: -1000 }} transition={{ duration: 0.5 }} className="UserTab">
                        <div className="UserTab_Content_Wrapper">
                            {user ? (
                                <>
                                    <div className="User_Tab_Section">
                                        <h1 className="">Perfil</h1>
                                        <div className="User_Tab_Ca">
                                            {user.photoURL && user.displayName && (
                                                <img className="User_Image" src={user.photoURL} alt={user.displayName} />
                                            )}
                                            {!user.photoURL && <span className="material-icons User_No_Image">person_pin</span>}

                                            <div className="User_Account_Info_Items">
                                                <div className="User_Info_Item">
                                                    <p className="User_Info_Label">Nome</p>
                                                    <p className="User_Info_Detail User_Name">{localUser?.name || "Nenhum Nome"}</p>
                                                </div>

                                                <div className="User_Info_Item">
                                                    <p className="User_Info_Label">Email</p>
                                                    <p className="User_Info_Detail User_Email">{localUser?.email}</p>
                                                </div>

                                                <div className="User_Info_Item">
                                                    <p className="User_Info_Label">Telefone</p>
                                                    <p className="User_Info_Detail User_ID">{localUser?.telephone}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {isAdmin && (
                                            <div className="User_Info_Item Control_Panel_Link">
                                                <Link href="/control-panel">
                                                    <h3>Abrir Painel de Controle</h3> <span className="material-icons">tune</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    <div className="User_Tab_Card">
                                        <h1 className="User_Adress_Title User_Page_Title">Endereço</h1>
                                        <div className="User_Adress_Info_Items">
                                            <div className="User_Info_Item">
                                                <div className="Info_Item_Text">
                                                    <p className="User_Info_Label">Rua</p>
                                                    {isEditing.street ? (
                                                        <input
                                                            className="User_Info_Input"
                                                            type="text"
                                                            placeholder="Nova Rua"
                                                            value={editedAddress.street}
                                                            onChange={(e) => handleAddressChange("street", e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="User_Info_Detail User_City">
                                                            {editedAddress.street !== address.street ? `${editedAddress.street}*` : address.street}
                                                        </p>
                                                    )}
                                                </div>

                                                {isEditing.street ? (
                                                    <span
                                                        className="material-icons User_Tab_Edit_Icon"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, street: false });
                                                        }}
                                                    >
                                                        save
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="material-icons User_Tab_Edit_Icon"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, street: true });
                                                        }}
                                                    >
                                                        edit
                                                    </span>
                                                )}
                                            </div>

                                            <div className="User_Info_Item">
                                                <div className="Info_Item_Text">
                                                    <p className="User_Info_Label">Número</p>
                                                    {isEditing.number ? (
                                                        <input
                                                            className="User_Info_Input"
                                                            type="text"
                                                            placeholder="Novo Número"
                                                            value={editedAddress.number}
                                                            onChange={(e) => handleAddressChange("number", e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="User_Info_Detail User_City">
                                                            {editedAddress.number !== address.number ? `${editedAddress.number}*` : address.number}
                                                        </p>
                                                    )}
                                                </div>

                                                {isEditing.number ? (
                                                    <span
                                                        className="material-icons User_Tab_Edit_Icon"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, number: false });
                                                        }}
                                                    >
                                                        save
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="material-icons User_Tab_Edit_Icon"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, number: true });
                                                        }}
                                                    >
                                                        edit
                                                    </span>
                                                )}
                                            </div>

                                            <div className="User_Info_Item">
                                                <div className="Info_Item_Text">
                                                    <p className="User_Info_Label">Complemento</p>
                                                    {isEditing.complement ? (
                                                        <input
                                                            className="User_Info_Input"
                                                            type="text"
                                                            placeholder="Novo Complemento"
                                                            value={editedAddress.extra}
                                                            onChange={(e) => handleAddressChange("complement", e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="User_Info_Detail User_City">
                                                            {editedAddress.complement !== address.complement
                                                                ? `${editedAddress.complement}*`
                                                                : address.complement}
                                                        </p>
                                                    )}
                                                </div>

                                                {isEditing.complement ? (
                                                    <span
                                                        className="material-icons User_Tab_Edit_Icon"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, complement: false });
                                                        }}
                                                    >
                                                        save
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="material-icons User_Tab_Edit_Icon"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, complement: true });
                                                        }}
                                                    >
                                                        edit
                                                    </span>
                                                )}
                                            </div>

                                            <div className="User_Info_Item">
                                                <div className="Info_Item_Text">
                                                    <p className="User_Info_Label">Cidade</p>
                                                    {isEditing.city ? (
                                                        <input
                                                            className="User_Info_Input"
                                                            type="text"
                                                            placeholder="Nova Cidade"
                                                            value={editedAddress.city}
                                                            onChange={(e) => handleAddressChange("city", e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="User_Info_Detail User_City">
                                                            {editedAddress.city !== address.city ? `${editedAddress.city}*` : address.city}
                                                        </p>
                                                    )}
                                                </div>

                                                {isEditing.city ? (
                                                    <span
                                                        className="material-icons User_Tab_Edit_Icon"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, city: false });
                                                        }}
                                                    >
                                                        save
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="material-icons User_Tab_Edit_Icon"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, city: true });
                                                        }}
                                                    >
                                                        edit
                                                    </span>
                                                )}
                                            </div>

                                            <div className="User_Info_Item">
                                                <div className="Info_Item_Text">
                                                    <p className="User_Info_Label">CEP</p>
                                                    {isEditing.zip ? (
                                                        <input
                                                            className="User_Info_Input"
                                                            type="text"
                                                            placeholder="Novo CEP"
                                                            value={editedAddress.zip}
                                                            onChange={(e) => handleAddressChange("zip", e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="User_Info_Detail User_City">
                                                            {editedAddress.zip !== address.zip ? `${editedAddress.zip}*` : address.zip}
                                                        </p>
                                                    )}
                                                </div>

                                                {isEditing.zip ? (
                                                    <span
                                                        className="material-icons User_Tab_Edit_Icon"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, zip: false });
                                                        }}
                                                    >
                                                        save
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="material-icons User_Tab_Edit_Icon"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, zip: true });
                                                        }}
                                                    >
                                                        edit
                                                    </span>
                                                )}
                                            </div>

                                            {isSomeAddressEdited && (
                                                <div className="User_Info_Edit_Control">
                                                    <button className="Order_SeeMore_Btn User_Info_Edit_Btn" onClick={discardChanges}>
                                                        <span className="material-icons">delete_forever</span>Descartar Alterações
                                                    </button>
                                                    <button className="Order_SeeMore_Btn User_Info_Edit_Btn" onClick={updateAddress}>
                                                        Atualizar Informações <span className="material-icons">update</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="User_Tab_Card">
                                        {" "}
                                        <h1 className="User_Adress_Title User_Page_Title">Pedidos</h1>
                                        <div className="User_Order_Info">
                                            {displayedOrders.map((order, index) => {
                                                return <OrderItem key={index} order={order} index={index} />;
                                            })}

                                            {noOrders && (
                                                <p className="User_No_Orders">
                                                    {" "}
                                                    <span className="material-icons User_No_Orders_Icon">receipt_long</span>Você ainda não fez nenhum
                                                    pedido
                                                </p>
                                            )}

                                            {!noOrders && orderList.length > 3 && (
                                                <div className="User_Order_SeeMore">
                                                    <button
                                                        className="Order_SeeMore_Btn"
                                                        onClick={() => {
                                                            setSeeMore(!seeMore);
                                                        }}
                                                    >
                                                        {(seeMore && (
                                                            <>
                                                                Ver apenas pedidos recentes
                                                                <span className="material-icons">expand_less</span>
                                                            </>
                                                        )) ||
                                                            (!seeMore && (
                                                                <>
                                                                    Ver todos os pedidos <span className="material-icons">more_horiz</span>
                                                                </>
                                                            ))}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button className="User_Btn" onClick={logout}>
                                        <span className="material-icons">logout</span>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="User_Login_Container">
                                    <button onClick={signIn} className="User_Google_Login_Btn">
                                        Faça Login com Google <span className="material-icons">login</span>
                                    </button>
                                    <div className="User_Email_Login">
                                        <input
                                            className="User_Login_Input"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email"
                                        />
                                        <input
                                            className="User_Login_Input Login_Password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Senha"
                                        />
                                        <button className="User_Login_Btn Register_Btn" onClick={signUp}>
                                            Registre uma conta com este Email <span className="material-icons">person_add_alt</span>
                                        </button>
                                        <button className="User_Login_Btn" onClick={login}>
                                            Login com Email <span className="material-icons">login</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}

/*  Armazenamento de Imagens no Firestore (?)

    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orders = await Promise.all(orderUID_List.map((uid) => fetchOrderDoc(uid)));
                const validOrders = orders.filter((order): order is Order => order !== undefined);
                setOrderList(validOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        fetchOrders();
    }, [orderUID_List]);


    <div className="User_Order_Item" key={index}>
                                                <div className="Order_Item_Text">
                                                    <h3 className="User_Info_Label">Pedido Nº</h3>
                                                    <h3 className="User_Order_Number">#{order.orderID}</h3>

                                                    <p className="User_Info_Detail User_Order_Date">
                                                        {new Intl.DateTimeFormat("pt-BR", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "2-digit",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }).format(order.orderDate.toDate())}
                                                    </p>

                                                    <div className="User_Order_Price">
                                                        <h4>Valor Total: </h4>
                                                        <p>
                                                            R$
                                                            {order.orderItems.reduce((total, product) => total + product.value * product.quantity, 0)}
                                                            ,00
                                                        </p>
                                                    </div>

                                                    <p className="User_Order_Status">
                                                        {order.status.confirmed === false && (
                                                            <>
                                                                <span className="material-icons">hourglass_bottom</span>
                                                                Aguardando Aprovação
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.waitingPayment === true && (
                                                            <>
                                                                <span className="material-icons">request_quote</span> Aguardando Pagamento
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.inProduction === true && (
                                                            <>
                                                                <span className="material-icons">category</span> Em Produção
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.waitingForRetrieval === true && (
                                                            <>
                                                                <span className="material-icons">store</span> Aguardando Retirada
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.waitingForDelivery === true && (
                                                            <>
                                                                <span className="material-icons">conveyor_belt</span> Aguardando Entrega
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.delivered === true && (
                                                            <>
                                                                <span className="material-icons">markunread_mailbox</span> Entregue
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.cancelled === true && (
                                                            <>
                                                                <span className="material-icons">do_not_disturb</span> Cancelado
                                                            </>
                                                        )}
                                                    </p>

                                                    <a
                                                        href={generateWhatsAppURL(order.orderID)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="User_Order_Status"
                                                    >
                                                        <span className="material-icons">support_agent</span> Solicitar Atendimento
                                                    </a>
                                                </div>

                                                <span className="material-icons Order_Expand_Btn">chevron_right</span>
                                            </div>

*/
