import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Axios para requisições HTTP
import axios from "axios";

// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";

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
import { setUserTabNeedsUpdate } from "@/store/slices/interface_slice";
import { setCurrentUser } from "@/store/slices/user_slice";

// Tipos de Dados
import { Order } from "@/types/Order";
import { Address } from "@/types/Address";
import { User as User_Local } from "@/types/User";
import { Subscription } from "@/types/Subscription";

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

export type SubscriptionCardProps = {
    subscription: Subscription;
    index: number;
};

// Componente de Assinatura
// Componente de Assinatura
export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="User_Order_Item User_Subscription_Item" key={index}>
            <div className="Order_Item_Text Subscription_Item_Text">
                <div className="Subscription_Item_Text_Headers_Container">
                    <div className="Subscription_Item_Text_Header_Item">
                        <h4 className="User_Info_Label">Plano de Assinatura</h4>
                        <p className="User_Subscription_Number">{subscription.subscription_name}</p>
                    </div>

                    <div className="User_Subscription_Price Subscription_Item_Text_Header_Item Bigger">
                        <h4>Valor Total: </h4>
                        <p>R$ {subscription.total},00</p>
                    </div>

                    <div className="Subscription_Item_Text_Header_Item">
                        <h4>Código Identificador</h4>
                        <p>{subscription.subscription_external_reference}</p>
                    </div>

                    <div className="User_Subscription_Date Subscription_Item_Text_Header_Item Bigger">
                        <h4>Data da Assinatura</h4>
                        <p className="User_Info_Detail User_Subscription_Date">
                            {new Date(subscription.subscription_date).toLocaleString("pt-BR", {
                                timeZone: "America/Sao_Paulo",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </p>
                    </div>

                    <div className="Subscription_Item_Text_Header_Item Bigger">
                        <h4>Duração</h4>
                        <p>
                            {subscription.subscription_duration} {subscription.subscription_duration === 1 ? " Mês" : " Meses"}
                        </p>
                    </div>
                </div>

                <p className="User_Order_Status User_Subscription_Status">
                    {Object.values(subscription.status).every((status) => status === false) && (
                        <>
                            <span className="material-icons">request_quote</span>
                            Aguardando Pagamento
                        </>
                    )}
                    {subscription.status.confirmed_by_admin === true && (
                        <>
                            <span className="material-icons">hourglass_bottom</span>
                            Confirmado
                        </>
                    )}
                    {subscription.status.waiting_payment === true && (
                        <>
                            <span className="material-icons">request_quote</span> Aguardando Pagamento
                        </>
                    )}
                    {subscription.status.in_production === true && (
                        <>
                            <span className="material-icons">verified</span> Assinatura Ativa
                        </>
                    )}
                    {subscription.status.waiting_for_retrieval === true && (
                        <>
                            <span className="material-icons">store</span> Aguardando Retirada
                        </>
                    )}
                    {subscription.status.retrieved === true && (
                        <>
                            <span className="material-icons">markunread_mailbox</span> Retirado no Balcão
                        </>
                    )}
                    {subscription.status.waiting_for_delivery === true && (
                        <>
                            <span className="material-icons">conveyor_belt</span> Aguardando Entrega
                        </>
                    )}
                    {subscription.status.delivered === true && (
                        <>
                            <span className="material-icons">markunread_mailbox</span> Entregue
                        </>
                    )}
                    {subscription.status.cancelled === true && (
                        <>
                            <span className="material-icons">do_not_disturb</span> Cancelado
                        </>
                    )}
                </p>

                <a
                    className="User_Order_Status_Call_Btn"
                    href={generate_whatsapp_url_for_more_order_info(subscription.subscription_external_reference, businessTelephone)}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="material-icons">support_agent</span> Solicitar Atendimento
                </a>
            </div>
        </div>
    );
};

// Propriedades do Componente de Pedido
export type OrderItemProps = {
    order: Order;
    index: number;
    order_number: string;
};

// Componente de Pedido
export const OrderItem: React.FC<OrderItemProps> = ({ order, index, order_number }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="User_Order_Item" key={index}>
            <div className="Order_Item_Text">
                <div className="Order_Item_Text_Headers_Container">
                    <div className="Order_Item_Text_Header">
                        <div className="Order_Item_Text_Header_Item">
                            <h4 className="User_Info_Label">Pedido Nº</h4>
                            <p className="User_Order_Number">#{order_number}</p>
                        </div>

                        <div className="Order_Item_Text_Header_Item">
                            <h4>Código Identificador</h4>
                            <p>{order.order_external_reference}</p>
                        </div>
                    </div>

                    <div className="Order_Item_Text_Header">
                        <div className="User_Order_Date Order_Item_Text_Header_Item Bigger">
                            <h4>Data do Pedido</h4>
                            <p className="User_Info_Detail User_Order_Date">
                                {new Date(order.order_date).toLocaleString("pt-BR", {
                                    timeZone: "America/Sao_Paulo",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>

                        <div className="User_Order_Price Order_Item_Text_Header_Item Bigger">
                            <h4>Valor Total: </h4>
                            <p>
                                R$
                                {order.order_items.reduce((total, order_item) => total + order_item.product.price * order_item.quantity, 0)}
                                ,00
                            </p>
                        </div>
                    </div>
                </div>

                <p className="User_Order_Status">
                    {Object.values(order.status).every((status) => status === false) && (
                        <>
                            <span className="material-icons">request_quote</span>
                            Aguardando Pagamento
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
                    className="User_Order_Status_Call_Btn"
                    href={generate_whatsapp_url_for_more_order_info(order.order_external_reference, businessTelephone)}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="material-icons">support_agent</span> Solicitar Atendimento
                </a>
            </div>

            <div className="Order_Expand_Btn" onClick={() => setIsExpanded(!isExpanded)}>
                <p className="Order_Expand_Btn_Text">Ver Detalhes do Pedido</p>
                <span className={isExpanded ? "material-icons Order_Expand_Btn_Icon Active" : "material-icons Order_Expand_Btn_Icon"}>
                    expand_more
                </span>
            </div>

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
                                <h4>Produtos</h4>
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
                                <h4 className="User_Order_Shipping_Option_Title">Método de Recebimento</h4>
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

export type User_Address_Info_Container_Props = {
    label: string;
    placeholder: string;
    propertie: string;
    localUser: User_Local;
    editedLocalUser: User_Local;
    handlelocalUserAddressChange: any;
};

export const User_Address_Info_Container: React.FC<User_Address_Info_Container_Props> = ({
    label,
    placeholder,
    propertie,
    localUser,
    editedLocalUser,
    handlelocalUserAddressChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedLocalUser.address[propertie]}
                        onChange={(e) => handlelocalUserAddressChange(propertie, e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedLocalUser.address[propertie] !== localUser.address[propertie]
                            ? `${editedLocalUser.address[propertie]}*`
                            : localUser.address[propertie]}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export type User_String_Info_Container_Props = {
    label: string;
    placeholder: string;
    propertie: string;
    localUser: User_Local;
    editedLocalUser: User_Local;
    handleLocalUserChange: any;
};

export const User_Name_Info_Container: React.FC<User_String_Info_Container_Props> = ({
    label,
    placeholder,
    propertie,
    localUser,
    editedLocalUser,
    handleLocalUserChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedLocalUser.name}
                        onChange={(e) => handleLocalUserChange("name", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">{editedLocalUser.name !== localUser.name ? `${editedLocalUser.name}*` : localUser.name}</p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const User_Email_Info_Container: React.FC<User_String_Info_Container_Props> = ({
    label,
    placeholder,
    propertie,
    localUser,
    editedLocalUser,
    handleLocalUserChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedLocalUser.email}
                        onChange={(e) => handleLocalUserChange("email", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedLocalUser.email !== localUser.email ? `${editedLocalUser.email}*` : localUser.email}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

export const User_Telephone_Info_Container: React.FC<User_String_Info_Container_Props> = ({
    label,
    placeholder,
    propertie,
    localUser,
    editedLocalUser,
    handleLocalUserChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="User_Info_Item_Container">
            <div className="User_Info_Item">
                <p className="User_Info_Item_Label">{label}</p>

                {/* Input de Edição ou Detalhe de Item */}
                {isEditing ? (
                    <input
                        className="User_Info_Item_Input"
                        type="text"
                        placeholder={placeholder}
                        value={editedLocalUser.telephone}
                        onChange={(e) => handleLocalUserChange("telephone", e.target.value)}
                    />
                ) : (
                    <p className="User_Info_Item_Detail">
                        {editedLocalUser.telephone !== localUser.telephone ? `${editedLocalUser.telephone}*` : localUser.telephone}
                    </p>
                )}
            </div>

            {/* Botões de Edição */}
            {isEditing ? (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">save</span>
                    <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                </div>
            ) : (
                <div
                    className="User_Info_Item_Edit_Btn"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    <span className="material-icons User_Tab_Edit_Icon">edit</span>
                    <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                </div>
            )}
        </div>
    );
};

// Componente de Aba de Usuário
export default function UserTab() {
    const firebase = useFirebase();
    const dispatch = useDispatch();

    // Referência para o Scroll com Framer Motion
    const scroll_ref = useRef(null);
    const { scrollYProgress } = useScroll({ container: scroll_ref });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Checar se o Firebase foi inicializado
    if (!firebase) {
        throw new Error("Firebase context is not available");
    }

    // Seletores do contexto Redux
    const [isCustomerLoading, setIsCustomerLoading] = useState(false);
    const customer = useSelector((state: RootState) => state.user.currentUser);
    const isUserTabOpen = useSelector((state: RootState) => state.interface.isUserTabOpen);
    const userTabNeedsUpdate = useSelector((state: RootState) => state.interface.userTabNeedsUpdate);

    // Dados de usuário temporarios, devo usar null ao invés disto.
    const temp_local_user: User_Local = {
        id: "123456789",
        name: "Usuário Anônimo",
        email: "example@example.com",
        avatar_url: "https://example.com/avatar.jpg",
        isOwner: false,
        isAdmin: false,
        isEditor: false,
        isSubscriber: false,
        telephone: "1234567890",
        address: {
            street: "Rua Teste",
            number: "123",
            complement: "Casa",
            city: "Teste",
            state: "TS",
            zip: "12345-678",
        },
        orders: [],
        subscriptions: [],
    };

    // Estados do usuário, user é o usuário padrão do Google e localUser é o usuário do nosso banco de dados
    // const [user, setUser] = useState<User | null>(null);
    // const [localUser, setLocalUser] = useState<User_Local>(temp_local_user);
    const [editedLocalUser, setEditedLocalUser] = useState<User_Local | null>(null);

    console.log(customer);
    console.log(editedLocalUser);

    const customer_has_not_updated_his_address =
        customer?.address?.street === "Nenhuma Rua Definida" ||
        customer?.address?.number === "Nenhum Número Definido" ||
        customer?.address?.city === "Nenhuma Cidade Definida" ||
        customer?.address?.state === "Nenhum Estado Definido" ||
        customer?.address?.zip === "Nenhum Código Postal Definido";

    // customer?.address?.complement === "Nenhum Complemento Definido" ||

    const customer_has_not_updated_his_main_info =
        customer?.name === "Nenhum Nome Definido" ||
        customer?.email === "Nenhum Email Definido" ||
        customer?.telephone === "Nenhum Número de Telefone Definido";

    const setCurrentUserAction = (localUser: User_Local | null) => {
        dispatch(setCurrentUser(localUser));
    };

    const setUserTabNeedsUpdateAction = (value: boolean) => {
        dispatch(setUserTabNeedsUpdate(value));
    };

    const userTabNeedsNoUpdateAction = () => {
        dispatch(setUserTabNeedsUpdate(false));
    };

    // Estados do campo de login
    const [loginWithEmailMode, setLoginWithEmailMode] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Funções para a atualização de dados do usuário
    const handleEditedLocalUserChange = (field: keyof User_Local, value: string | boolean | Address | string[]) => {
        if (editedLocalUser) {
            setEditedLocalUser((prevState) => {
                if (prevState) {
                    return { ...prevState, [field]: value };
                } else {
                    return null;
                }
            });
        }
    };

    const handleEditedLocalUserAddressChange = (field: keyof Address, value: string) => {
        setEditedLocalUser((prevState) => {
            if (prevState) {
                return { ...prevState, address: { ...prevState.address, [field]: value } };
            } else {
                return null;
            }
        });
    };

    const discardLocalUserChanges = () => {
        if (customer) {
            setEditedLocalUser(customer);
        }
    };

    const updateUser = async () => {
        if (!editedLocalUser) {
            console.error("No edited user data to update");
            return;
        }

        try {
            await axios.post(`${NEXT_PUBLIC_PATH_API_UPDATE_USER}`, editedLocalUser);
            setCurrentUserAction(editedLocalUser);
            setUserTabNeedsUpdateAction(true);
            console.log("User updated successfully");
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    //
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
    console.log(customer);
    console.log(editedLocalUser);
    // const isSomeLocalUserInfoEdited = customer && editedLocalUser && JSON.stringify(customer) !== JSON.stringify(editedLocalUser);

    let isSomeLocalUserInfoEdited;

    if (customer && editedLocalUser) {
        const sortedCustomer = sortObjectProperties(customer);
        const sortedEditedLocalUser = sortObjectProperties(editedLocalUser);
        console.log(sortedCustomer);
        console.log(sortedEditedLocalUser);
        isSomeLocalUserInfoEdited =
            sortedCustomer && sortedEditedLocalUser && JSON.stringify(sortedCustomer) !== JSON.stringify(sortedEditedLocalUser);
    } else {
        isSomeLocalUserInfoEdited = false;
    }

    console.log(isSomeLocalUserInfoEdited);

    // Estado para ver mais do que 3 pedidos
    const [seeMore, setSeeMore] = useState(false);

    // Estado para ver os pedidos do usuário
    const [orderList, setOrderList] = useState<Order[]>([]);
    const sortedOrders = orderList.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
    const displayedOrders = seeMore ? sortedOrders : sortedOrders.slice(0, 3);
    const noOrders = orderList.length < 1;

    // Estado para ver as assinaturas do usuário
    const [subscriptionList, setSubscriptionList] = useState<Subscription[]>([]);
    const noSubscriptions = subscriptionList.length < 1;

    // Funções de Autenticação
    // Login com Google
    const signInWithGoogle = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("User signed in:", result.user);
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    // Login com Email e Senha
    const signinWithEmail = async () => {
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
            console.log("User logged in:", userCredential.user);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const logout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            setCurrentUserAction(null);
            console.log("User signed out");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // Função para buscar o documento do usuário no Firestore
    const fetchUserData = async (uid: string) => {
        // setIsCustomerLoading(true);
        try {
            // Fetch user data from get_user API
            const response = await axios.get(`${NEXT_PUBLIC_PATH_API_GET_USER}`, { params: { id: uid } });
            // console.log("User data from API:", response.data);

            if (response.status === 400) {
                console.error("Missing required fields, cannot fetch user data");
                setIsCustomerLoading(false);
            }

            if (response.data.message === "user-not-found") {
                console.log("User not found");
                setIsCustomerLoading(false);
            }

            if (response.data) {
                setEditedLocalUser(response.data as User_Local);
                fetchSubscriptionsForUser(response.data as User_Local);
                fetchOrdersForUser(response.data as User_Local);
                setIsCustomerLoading(false);
                console.log("Local User: ", response.data);
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
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

    const fetchSubscriptionsForUser = async (user: User_Local): Promise<Subscription[] | undefined> => {
        const user_subscriptions = user.subscriptions;
        console.log("User Subscriptions:", user_subscriptions);

        if (user_subscriptions.length < 1) {
            console.log("Usuário nao possui Assinaturas.");
            return [];
        }

        try {
            const subscriptions: (Subscription | undefined)[] = await Promise.all(
                user_subscriptions.map(async (subscription_id) => {
                    const subscription = await fetchSubscriptionDoc(subscription_id);
                    if (subscription) {
                        console.log(subscription);
                        return subscription;
                    }
                })
            );

            // Filter out any undefined values
            const validSubscriptions: Subscription[] = subscriptions.filter(
                (subscription): subscription is Subscription => subscription !== undefined
            );

            // Set the subscription list with the valid subscriptions
            setSubscriptionList(validSubscriptions);

            return validSubscriptions;
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            return undefined;
        }
    };

    // Função para buscar todos os pedidos para o usuário - O usuário deve ter uma lista de referências externas de pedidos e então buscamos no banco de dados
    const fetchOrdersForUser = async (user: User_Local): Promise<Order[] | undefined> => {
        const user_orders = user.orders;
        console.log("User Orders:", user_orders);

        if (user_orders.length < 1) {
            console.log("Usuário nao possui pedidos.");
            return [];
        }

        try {
            const orders: (Order | undefined)[] = await Promise.all(
                user_orders.map(async (order_id) => {
                    const order = await fetchOrderDoc(order_id);
                    if (order) {
                        console.log(order);
                        return order;
                    }
                })
            );

            // Filter out any undefined values
            const validOrders: Order[] = orders.filter((order): order is Order => order !== undefined);

            // Set the order list with the valid orders
            setOrderList(validOrders);

            return validOrders;
        } catch (error) {
            console.error("Error fetching orders:", error);
            return undefined;
        }
    };

    useEffect(() => {
        if (customer) {
            fetchUserData(customer.id);
        }
    }, [customer]);

    return (
        <>
            <AnimatePresence>
                {isUserTabOpen && (
                    <m.div initial={{ x: -1000 }} animate={{ x: 0 }} exit={{ x: -1000 }} transition={{ duration: 0.5 }} className="User_Tab">
                        {/* Wrapper do Conteúdo da Aba do Usuário */}
                        <div
                            className={isSomeLocalUserInfoEdited ? "UserTab_Content_Wrapper Extra_Bottom_Padding" : "UserTab_Content_Wrapper"}
                            ref={scroll_ref}
                        >
                            {isCustomerLoading ? (
                                <div className="User_Tab_Loading">
                                    <div className="User_Tab_Loading_Spinner">Carregando Usuário</div>
                                </div>
                            ) : (
                                <>
                                    {customer && editedLocalUser ? (
                                        <>
                                            {/* Card de Informações Gerais */}
                                            <div className="User_Tab_Card">
                                                <h1 className="User_Tab_Card_Title">Informações Gerais</h1>
                                                {customer_has_not_updated_his_main_info && (
                                                    <div className="User_Card_Address_Alert">
                                                        <span className="material-icons">info</span>
                                                        <p className="User_Card_Address_Alert_Text">
                                                            Preencha corretamente estas informações antes de efetuar um pedido.
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="User_Tab_Card_Info">
                                                    <div className="User_Tab_Card_Info_Image_Container">
                                                        {customer.avatar_url && customer.name && (
                                                            <img className="User_Tab_Card_Info_Image" src={customer.avatar_url} alt={customer.name} />
                                                        )}
                                                        {!customer.avatar_url && (
                                                            <span className="material-icons User_Tab_Card_Info_No_Image">person_pin</span>
                                                        )}

                                                        <div className="User_Tab_Card_Info_Image_Edit_Btn">
                                                            <span className="material-icons User_Info_Item_Edit_Btn_Icon" onClick={() => {}}>
                                                                edit
                                                            </span>
                                                            <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                                                        </div>
                                                    </div>

                                                    <div className="User_Tab_Card_Info_Items_List">
                                                        <User_Name_Info_Container
                                                            key="Nome"
                                                            label="Nome"
                                                            placeholder="Novo Nome"
                                                            propertie="name"
                                                            localUser={customer}
                                                            editedLocalUser={editedLocalUser}
                                                            handleLocalUserChange={handleEditedLocalUserChange}
                                                        />

                                                        <User_Email_Info_Container
                                                            key="Email"
                                                            label="Email"
                                                            placeholder="Novo Email"
                                                            propertie="email"
                                                            localUser={customer}
                                                            editedLocalUser={editedLocalUser}
                                                            handleLocalUserChange={handleEditedLocalUserChange}
                                                        />

                                                        <User_Telephone_Info_Container
                                                            key="Telefone"
                                                            label="Telefone"
                                                            placeholder="Novo Telefone"
                                                            propertie="telephone"
                                                            localUser={customer}
                                                            editedLocalUser={editedLocalUser}
                                                            handleLocalUserChange={handleEditedLocalUserChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card de Informações de Administrador */}
                                            {customer && customer.isAdmin === true && (
                                                <div className="User_Tab_Card">
                                                    <h1 className="User_Tab_Card_Title">Administração</h1>

                                                    <div className="Admin_Actions_List">
                                                        <Link className="Control_Panel_Link_Btn" href="/admin/control-panel">
                                                            <p className="Control_Panel_Link_Btn_Text">Painel de Gestão</p>
                                                            <span className="material-icons">tune</span>
                                                        </Link>

                                                        <Link className="Control_Panel_Link_Btn" href="/admin/product-editor">
                                                            <p className="Control_Panel_Link_Btn_Text">Editor de Produtos</p>
                                                            <span className="material-icons">sell</span>
                                                        </Link>

                                                        <Link className="Control_Panel_Link_Btn" href="/admin/order-control">
                                                            <p className="Control_Panel_Link_Btn_Text">Controle de Pedidos</p>
                                                            <span className="material-icons">list_alt</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Card de Informações de Entrega */}
                                            <div className="User_Tab_Card">
                                                <h1 className="User_Tab_Card_Title">Informações de Entrega</h1>

                                                {customer_has_not_updated_his_address && (
                                                    <div className="User_Card_Address_Alert">
                                                        <span className="material-icons">info</span>
                                                        <p className="User_Card_Address_Alert_Text">
                                                            Preencha corretamente estas informações antes de efetuar um pedido.
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="User_Tab_Card_Info_Items_List">
                                                    <User_Address_Info_Container
                                                        key={"Rua"}
                                                        label="Rua"
                                                        placeholder="Nova Rua"
                                                        propertie="street"
                                                        localUser={customer}
                                                        editedLocalUser={editedLocalUser}
                                                        handlelocalUserAddressChange={handleEditedLocalUserAddressChange}
                                                    />

                                                    <User_Address_Info_Container
                                                        key={"Numero"}
                                                        label="Número"
                                                        placeholder="Novo Número"
                                                        propertie="number"
                                                        localUser={customer}
                                                        editedLocalUser={editedLocalUser}
                                                        handlelocalUserAddressChange={handleEditedLocalUserAddressChange}
                                                    />

                                                    <User_Address_Info_Container
                                                        key={"Complemento"}
                                                        label="Complemento"
                                                        placeholder="Novo Complemento"
                                                        propertie="complement"
                                                        localUser={customer}
                                                        editedLocalUser={editedLocalUser}
                                                        handlelocalUserAddressChange={handleEditedLocalUserAddressChange}
                                                    />

                                                    <User_Address_Info_Container
                                                        key={"Cidade"}
                                                        label="Cidade"
                                                        placeholder="Nova Cidade"
                                                        propertie="city"
                                                        localUser={customer}
                                                        editedLocalUser={editedLocalUser}
                                                        handlelocalUserAddressChange={handleEditedLocalUserAddressChange}
                                                    />

                                                    <User_Address_Info_Container
                                                        key={"Estado"}
                                                        label="Estado"
                                                        placeholder="Novo Estado"
                                                        propertie="state"
                                                        localUser={customer}
                                                        editedLocalUser={editedLocalUser}
                                                        handlelocalUserAddressChange={handleEditedLocalUserAddressChange}
                                                    />

                                                    <User_Address_Info_Container
                                                        key={"ZIP"}
                                                        label="Código Postal"
                                                        placeholder="Novo Código Postal"
                                                        propertie="zip"
                                                        localUser={customer}
                                                        editedLocalUser={editedLocalUser}
                                                        handlelocalUserAddressChange={handleEditedLocalUserAddressChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* Card de Informações Sobre as Assinaturas */}
                                            <div className="User_Tab_Card">
                                                <h1 className="User_Tab_Card_Title">Clube Tropical</h1>

                                                {/* Lista de Pedidos do Usuário */}
                                                {subscriptionList.map((subscription, index) => {
                                                    return <SubscriptionCard subscription={subscription} index={index} key={index} />;
                                                })}

                                                {noSubscriptions && (
                                                    <div className="User_No_Orders">
                                                        <span className="material-icons User_No_Orders_Icon">loyalty</span>
                                                        <p className="User_No_Orders_Text">Nenhuma assinatura ativa.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Card de Informações Sobre os Pedidos */}
                                            <div className="User_Tab_Card">
                                                <h1 className="User_Tab_Card_Title">Pedidos Realizados</h1>
                                                <div className="User_Order_List">
                                                    {/* Lista de Pedidos do Usuário */}
                                                    {displayedOrders.map((order, index) => {
                                                        const orderNumber = (sortedOrders.length - index).toString().padStart(4, "0");
                                                        return <OrderItem key={index} order={order} index={index} order_number={orderNumber} />;
                                                    })}

                                                    {/* Mensagem de Carrinho Vazio */}
                                                    {noOrders && (
                                                        <div className="User_No_Orders">
                                                            <span className="material-icons User_No_Orders_Icon">receipt_long</span>
                                                            <p className="User_No_Orders_Text">Você ainda não fez nenhum pedido.</p>
                                                        </div>
                                                    )}

                                                    {/* Botão para ver mais do que os 3 pedidos mais recentes */}
                                                    {!noOrders && orderList.length > 3 && (
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
                                                    )}
                                                </div>
                                            </div>

                                            {/* Botão de Logout */}
                                            <button className="Logout_Btn" onClick={logout}>
                                                <span className="material-icons Logout_Btn_Icon">logout</span>
                                                <p className="Logout_Btn_Text">Fazer Logout</p>
                                            </button>
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </>
                            )}
                        </div>

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
                        <div className="Progress_Bar_Container">
                            <div className="Progress_Bar_Wrapper">
                                <m.div className="Progress_Bar" style={{ scaleX }} />
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* Estados para a atualização de dados do endereço do usuário
    
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
*/

/* User_Info_Item_Container Original

<div className="User_Info_Item_Container">
    <div className="User_Info_Item">
        <p className="User_Info_Item_Label">Rua</p>

                                                    
                                                    {isEditing.street ? (
                                                        <input
                                                            className="User_Info_Item_Input"
                                                            type="text"
                                                            placeholder="Nova Rua"
                                                            value={editedAddress.street}
                                                            onChange={(e) => handleAddressChange("street", e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="User_Info_Item_Detail User_City">
                                                            {editedAddress.street !== address.street ? `${editedAddress.street}*` : address.street}
                                                        </p>
                                                    )}
                                                </div>

                                                
                                                {isEditing.street ? (
                                                    <div
                                                        className="User_Info_Item_Edit_Btn"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, street: false });
                                                        }}
                                                    >
                                                        <span className="material-icons User_Tab_Edit_Icon">save</span>
                                                        <p className="User_Info_Item_Edit_Btn_Text">salvar</p>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="User_Info_Item_Edit_Btn"
                                                        onClick={() => {
                                                            setIsEditing({ ...isEditing, street: true });
                                                        }}
                                                    >
                                                        <span className="material-icons User_Tab_Edit_Icon">edit</span>
                                                        <p className="User_Info_Item_Edit_Btn_Text">editar</p>
                                                    </div>
                                                )}
                                            </div>
*/

/*  Circulo de Progresso de Scroll

    <svg id="progress" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="30" pathLength="1" className="bg" />
        <m.circle cx="50" cy="50" r="30" pathLength="1" className="indicator" style={{ pathLength: scrollYProgress }} />
    </svg>
*/

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
