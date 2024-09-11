import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";

import Link from "next/link";
import { generate_whatsapp_url_for_more_order_info, generate_whatsapp_url_for_contacting_client } from "@/util/WhatsApp";

import axios from "axios";

import { AnimatePresence, motion as m } from "framer-motion";

import { Subscription } from "@/types/Subscription";

const UPDATE_SPECIFIC_SUBSCRIPTION_API = process.env.NEXT_PUBLIC_PATH_API_UPDATE_SPECIFIC_SUBSCRIPTION;

if (!UPDATE_SPECIFIC_SUBSCRIPTION_API) {
    throw new Error("The NEXT_PUBLIC_PATH_API_UPDATE_SPECIFIC_SUBSCRIPTION environment variable is not defined");
}

const GET_ALL_SUBSCRIPTIONS_API = process.env.NEXT_PUBLIC_PATH_API_GET_ALL_SUBSCRIPTIONS;

if (!GET_ALL_SUBSCRIPTIONS_API) {
    throw new Error("The NEXT_PUBLIC_PATH_API_GET_ALL_SUBSCRIPTIONS environment variable is not defined");
}

const businessTelephone = process.env.NEXT_PUBLIC_BUSINESS_MAIN_TELEPHONE;

if (!businessTelephone) {
    throw new Error("BUSINESS_MAIN_TELEPHONE environment variable is not defined");
}

export type SubscriptionCardProps = {
    subscription: Subscription;
    index: number;
    updateSubscription: (updatedSubscription: Subscription) => void;
};

// Componente de Assinatura
// Componente de Assinatura
export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, index, updateSubscription }) => {
    const user = useSelector((state: RootState) => state.user);
    const [isExpanded, setIsExpanded] = useState(false);
    const [editedSubscription, setEditedSubscription] = useState(subscription);
    const [isEditing, setIsEditing] = useState(false);

    const cleanPhoneNumber = (phoneNumber: string): string => {
        return phoneNumber.replace(/[-()\s]/g, "");
    };

    return (
        <div className="User_Order_Item Order_Control_Item Subscription_Control_Item" key={index}>
            <div className="Subscription_Item_Header">
                <div className="Subscription_Item_Text_Header_Item">
                    <h4>Nome do Cliente</h4>
                    <p>{subscription.customer_name}</p>
                </div>

                <div className="Subscription_Item_Text_Header_Item">
                    <h4 className="User_Info_Label">Plano de Assinatura</h4>
                    <p className="User_Subscription_Number">{subscription.subscription_name}</p>
                </div>

                <div className="User_Subscription_Price Subscription_Item_Text_Header_Item">
                    <h4>Valor Total: </h4>
                    <p>R$ {subscription.total},00</p>
                </div>

                <div className="Subscription_Item_Text_Header_Item">
                    <h4>Código Identificador</h4>
                    <p>{subscription.subscription_external_reference}</p>
                </div>

                <div className="User_Subscription_Date Subscription_Item_Text_Header_Item">
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

                <div className="Subscription_Item_Text_Header_Item">
                    <h4>Duração</h4>
                    <p>
                        {subscription.subscription_duration} {subscription.subscription_duration === 1 ? " Mês" : " Meses"}
                    </p>
                </div>
            </div>

            <div className="Subscription_Item_Status Subscription_Control_Status">
                <h4>Status</h4>
                {Object.values(subscription.status).every((status) => status === false) && (
                    <>
                        <div className="Subscription_Status_State">
                            <span className="material-icons">hourglass_bottom</span>
                            <p>Aguardando Pagamento</p>
                            <div className="Subscription_Status_Alert">
                                <span className="material-icons">info</span>
                                <p>
                                    Se você nao concluiu o pagamento acesse o link abaixo, caso contrário aguarde alguns minutos e se nao estiver
                                    atualizado solicite atendimento.
                                </p>
                            </div>

                            <Link
                                href={subscription.subscription_payment_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="Subscription_Status_State_Payment_Link"
                            >
                                <span className="material-icons">payment</span> Link de Pagamento
                            </Link>
                        </div>
                    </>
                )}
                {subscription.status.confirmed_by_admin === true && (
                    <>
                        <div className="Subscription_Status_State">
                            <span className="material-icons">check</span>
                            <p>Confirmado</p>
                        </div>
                    </>
                )}
                {subscription.status.waiting_payment === true && (
                    <>
                        <div className="Subscription_Status_State">
                            <span className="material-icons">hourglass_bottom</span>
                            <p>Aguardando Pagamento</p>
                            <div className="Subscription_Status_Alert">
                                <span className="material-icons">info</span>
                                <p>
                                    Se você nao concluiu o pagamento acesse o link abaixo, caso contrário aguarde alguns minutos e se nao estiver
                                    atualizado solicite atendimento.
                                </p>
                            </div>

                            <Link
                                href={subscription.subscription_payment_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="Subscription_Status_State_Payment_Link"
                            >
                                <span className="material-icons">payment</span> Link de Pagamento
                            </Link>
                        </div>
                    </>
                )}
                {subscription.status.in_production === true && (
                    <>
                        <div className="Subscription_Status_State">
                            <span className="material-icons">loyalty</span>
                            <p>Assinatura Ativa</p>
                        </div>
                    </>
                )}
                {subscription.status.waiting_for_retrieval === true && (
                    <>
                        <div className="Subscription_Status_State">
                            <span className="material-icons">inventory</span>
                            <p>Aguardando Retirada</p>
                        </div>
                    </>
                )}
                {subscription.status.retrieved === true && (
                    <>
                        <div className="Subscription_Status_State">
                            <span className="material-icons">store</span>
                            <p>Retirado no Balcão</p>
                        </div>
                    </>
                )}
                {subscription.status.waiting_for_delivery === true && (
                    <>
                        <div className="Subscription_Status_State">
                            <span className="material-icons">conveyor_belt</span>
                            <p>Aguardando Entrega</p>
                        </div>
                    </>
                )}
                {subscription.status.delivered === true && (
                    <>
                        <div className="Subscription_Status_State">
                            <span className="material-icons">markunread_mailbox</span>

                            <p>Entregue</p>
                        </div>
                    </>
                )}
                {subscription.status.cancelled === true && (
                    <>
                        <div className="Subscription_Status_State">
                            <span className="material-icons">block</span>
                            <p>Cancelado</p>
                        </div>
                    </>
                )}
            </div>

            <m.div layout key="order_item_actions" className="User_Order_Actions">
                <m.a
                    className="User_Order_Status_Call_Btn"
                    href={generate_whatsapp_url_for_contacting_client(subscription.customer_name, cleanPhoneNumber(subscription.customer_phone))}
                    target="_blank"
                    rel="noopener noreferrer"
                    layout
                >
                    <span className="material-icons">support_agent</span> Entrar em Contato com o Cliente
                </m.a>

                <AnimatePresence>
                    {!isEditing && (
                        <m.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                            className="User_Order_Status_Call_Btn User_Order_Change_Status_Btn"
                            key={"User_Order_Status_Btn"}
                            layout
                            onClick={() => {
                                setIsEditing(true);
                            }}
                        >
                            <span className="material-icons">published_with_changes</span>
                            <p className="User_Order_Change_Status_Btn_Text">Alterar Status da Assinatura</p>
                        </m.button>
                    )}

                    {isEditing && (
                        <m.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                            className="User_Order_Edit_Status"
                            key={"User_Order_Edit_Status"}
                            layout
                        >
                            <h4>Alterar Status do Pedido</h4>
                            <div className="User_Order_Edit_Status_Options">
                                <button
                                    className={`User_Order_Edit_Status_Option ${editedSubscription.status.waiting_payment ? "Active" : ""} ${
                                        subscription.status.waiting_payment ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedSubscription((currentSubscription) => ({
                                            ...currentSubscription,
                                            status: {
                                                ...currentSubscription.status,
                                                confirmed_by_admin: false,
                                                waiting_payment: true,
                                                in_production: false,
                                                waiting_for_retrieval: false,
                                                retrieved: false,
                                                waiting_for_delivery: false,
                                                delivered: false,
                                                cancelled: false,
                                            },
                                        }));
                                    }}
                                >
                                    Aguardando Pagamento
                                </button>
                                <button
                                    className={`User_Order_Edit_Status_Option ${editedSubscription.status.confirmed_by_admin ? "Active" : ""} ${
                                        subscription.status.confirmed_by_admin ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedSubscription((currentSubscription) => ({
                                            ...currentSubscription,
                                            status: {
                                                ...currentSubscription.status,
                                                confirmed_by_admin: true,
                                                waiting_payment: false,
                                                in_production: false,
                                                waiting_for_retrieval: false,
                                                retrieved: false,
                                                waiting_for_delivery: false,
                                                delivered: false,
                                                cancelled: false,
                                            },
                                        }));
                                    }}
                                >
                                    Confirmado
                                </button>
                                <button
                                    className={`User_Order_Edit_Status_Option ${editedSubscription.status.in_production ? "Active" : ""} ${
                                        subscription.status.in_production ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedSubscription((currentSubscription) => ({
                                            ...currentSubscription,
                                            status: {
                                                ...currentSubscription.status,
                                                confirmed_by_admin: false,
                                                waiting_payment: false,
                                                in_production: true,
                                                waiting_for_retrieval: false,
                                                retrieved: false,
                                                waiting_for_delivery: false,
                                                delivered: false,
                                                cancelled: false,
                                            },
                                        }));
                                    }}
                                >
                                    Assinatura Ativa
                                </button>
                                <button
                                    className={`User_Order_Edit_Status_Option ${editedSubscription.status.waiting_for_retrieval ? "Active" : ""} ${
                                        subscription.status.waiting_for_retrieval ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedSubscription((currentSubscription) => ({
                                            ...currentSubscription,
                                            status: {
                                                ...currentSubscription.status,
                                                confirmed_by_admin: false,
                                                waiting_payment: false,
                                                in_production: false,
                                                waiting_for_retrieval: true,
                                                retrieved: false,
                                                waiting_for_delivery: false,
                                                delivered: false,
                                                cancelled: false,
                                            },
                                        }));
                                    }}
                                >
                                    Aguardando Retirada
                                </button>
                                <button
                                    className={`User_Order_Edit_Status_Option ${editedSubscription.status.retrieved ? "Active" : ""} ${
                                        subscription.status.retrieved ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedSubscription((currentSubscription) => ({
                                            ...currentSubscription,
                                            status: {
                                                ...currentSubscription.status,
                                                confirmed_by_admin: false,
                                                waiting_payment: false,
                                                in_production: false,
                                                waiting_for_retrieval: false,
                                                retrieved: true,
                                                waiting_for_delivery: false,
                                                delivered: false,
                                                cancelled: false,
                                            },
                                        }));
                                    }}
                                >
                                    Retirado no Balcão
                                </button>
                                <button
                                    className={`User_Order_Edit_Status_Option ${editedSubscription.status.waiting_for_delivery ? "Active" : ""} ${
                                        subscription.status.waiting_for_delivery ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedSubscription((currentSubscription) => ({
                                            ...currentSubscription,
                                            status: {
                                                ...currentSubscription.status,
                                                confirmed_by_admin: false,
                                                waiting_payment: false,
                                                in_production: false,
                                                waiting_for_retrieval: false,
                                                retrieved: false,
                                                waiting_for_delivery: true,
                                                delivered: false,
                                                cancelled: false,
                                            },
                                        }));
                                    }}
                                >
                                    Aguardando Entrega
                                </button>
                                <button
                                    className={`User_Order_Edit_Status_Option ${editedSubscription.status.delivered ? "Active" : ""} ${
                                        subscription.status.delivered ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedSubscription((currentSubscription) => ({
                                            ...currentSubscription,
                                            status: {
                                                ...currentSubscription.status,
                                                confirmed_by_admin: false,
                                                waiting_payment: false,
                                                in_production: false,
                                                waiting_for_retrieval: false,
                                                retrieved: false,
                                                waiting_for_delivery: false,
                                                delivered: true,
                                                cancelled: false,
                                            },
                                        }));
                                    }}
                                >
                                    Entregue
                                </button>
                                <button
                                    className={`User_Order_Edit_Status_Option ${editedSubscription.status.cancelled ? "Active" : ""} ${
                                        subscription.status.cancelled ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedSubscription((currentSubscription) => ({
                                            ...currentSubscription,
                                            status: {
                                                ...currentSubscription.status,
                                                confirmed_by_admin: false,
                                                waiting_payment: false,
                                                in_production: false,
                                                waiting_for_retrieval: false,
                                                retrieved: false,
                                                waiting_for_delivery: false,
                                                delivered: false,
                                                cancelled: true,
                                            },
                                        }));
                                    }}
                                >
                                    Cancelado
                                </button>
                            </div>
                            <button
                                className="User_Order_Edit_Status_Save_Btn"
                                onClick={async () => {
                                    try {
                                        const response = await axios.post(
                                            `${UPDATE_SPECIFIC_SUBSCRIPTION_API}`,
                                            {
                                                userId: user.currentUser?.id,
                                                subscriptionId: subscription.subscription_external_reference,
                                                editedSubscription,
                                            },
                                            {
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                            }
                                        );
                                        if (response.data.error) {
                                            console.error(response.data.error);
                                        } else {
                                            console.log(response.data.subscription_data);
                                            updateSubscription(response.data.subscription_data as Subscription);
                                        }
                                    } catch (error) {
                                        if (axios.isAxiosError(error)) {
                                            console.error(error.response?.data);
                                        } else {
                                            console.error("An unexpected error occurred:", error);
                                        }
                                    }
                                    setIsEditing(false);
                                }}
                            >
                                Salvar Alterações
                            </button>

                            <button
                                className="User_Order_Edit_Status_Cancel_Btn"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedSubscription(subscription);
                                }}
                            >
                                Cancelar Alterações
                            </button>
                        </m.div>
                    )}
                </AnimatePresence>
            </m.div>
        </div>
    );
};

const SubscriptionControl = () => {
    const user = useSelector((state: RootState) => state.user);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

    function updateSubscriptionInList(updatedSubscription: Subscription) {
        const subscriptionsCopy = [...subscriptions];
        const subscriptionIndex = subscriptionsCopy.findIndex(
            (subscription) => subscription.subscription_external_reference === updatedSubscription.subscription_external_reference
        );

        console.log("Updating subscription with external reference:", updatedSubscription.subscription_external_reference); // Log the reference you're trying to update
        console.log(
            "Available external references in subscriptions:",
            subscriptionsCopy.map((s) => s.subscription_external_reference)
        ); // Log all available references

        if (subscriptionIndex !== -1) {
            subscriptionsCopy[subscriptionIndex] = updatedSubscription;
            setSubscriptions(subscriptionsCopy);
        } else {
            console.log("Error updating order. Order with the given external reference not found.");
        }
    }

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.post(
                `${GET_ALL_SUBSCRIPTIONS_API}`,
                { user_id: user.currentUser?.id }, // Correctly formatted as an object
                {
                    headers: {
                        "Content-Type": "application/json", // Ensure the server treats this as JSON
                    },
                }
            );
            if (response.data.error) {
                console.error(response.data.error);
            } else {
                setSubscriptions(response.data as Subscription[]);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data);
            } else {
                console.error("An unexpected error occurred:", error);
            }
        }
    };

    useEffect(() => {
        if (user.currentUser) {
            fetchSubscriptions();
        } else {
            setSubscriptions([]);
        }
    }, [user.currentUser]);

    return (
        <>
            <div className="Product_Control_Card Control_Card">
                <h2 className="Control_Title">Controle de Assinaturas</h2>

                <div className="Order_Control_Filter">
                    <h2 className="Order_Control_Filter_Title">Filtro de Assinaturas</h2>

                    <div className="Order_Control_Filter_Inputs">
                        <div className="Order_Control_Filter_Item Order_Control_General_Search_Filter">
                            <span className="material-icons">search</span>

                            <input
                                type="text"
                                placeholder="Buscar Assinatura (Nome do Cliente, Código de Identificação, Endereço de Entrega, etc.)"
                                onChange={(e) => {
                                    // setGeneralSearch(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="Order_Control_List grid">
                    {subscriptions.map((subscription, index) => (
                        <SubscriptionCard key={index} subscription={subscription} index={index} updateSubscription={updateSubscriptionInList} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default SubscriptionControl;
