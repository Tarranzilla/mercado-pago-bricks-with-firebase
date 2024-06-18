import { useState } from "react";
import { Subscription } from "@/types/Subscription";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Funções Utilitárias
import { generate_whatsapp_url_for_more_order_info } from "@/util/WhatsApp";

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

                <div className="User_Order_Status User_Subscription_Status">
                    <h4>Status</h4>
                    {Object.values(subscription.status).every((status) => status === false) && (
                        <>
                            <div className="User_Order_Status_State">
                                <p>Aguardando Pagamento</p>
                                <span className="material-icons">request_quote</span>
                            </div>
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
                </div>

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

const User_Tab_Subscriptions = () => {
    // Estado para ver as assinaturas do usuário
    const subscriptionList = useSelector((state: RootState) => state.user.currentUserSubscriptions);
    const noSubscriptions = subscriptionList.length < 1;

    return (
        <>
            <div className="User_Tab_Card">
                <h1 className="User_Tab_Card_SubTitle">Clube Tropical</h1>

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
        </>
    );
};

export default User_Tab_Subscriptions;
