import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { Order } from "@/types/Order";

import { AnimatePresence, motion as m } from "framer-motion";

import Link from "next/link";

import { generate_whatsapp_url_for_more_order_info } from "@/util/WhatsApp";

const businessTelephone = process.env.NEXT_PUBLIC_BUSINESS_MAIN_TELEPHONE;

if (!businessTelephone) {
    throw new Error("BUSINESS_MAIN_TELEPHONE environment variable is not defined");
}

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
                    <div className="Order_Item_Text_Header_Item">
                        <h4 className="User_Info_Label">Pedido Nº</h4>
                        <p className="User_Order_Number">#{order_number}</p>
                    </div>

                    <div className="User_Order_Price Order_Item_Text_Header_Item Bigger">
                        <h4>Valor Total: </h4>
                        <p>
                            R$
                            {order.order_items.reduce((total, order_item) => total + order_item.product.price * order_item.quantity, 0)}
                            ,00
                        </p>
                    </div>

                    <div className="Order_Item_Text_Header_Item">
                        <h4>Código Identificador</h4>
                        <p>{order.order_external_reference}</p>
                    </div>

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
                </div>

                <div className="User_Order_Status">
                    <h4>Status </h4>
                    {Object.values(order.status).every((status) => status === false) && (
                        <>
                            <div className="User_Order_Status_State">
                                <p>Aguardando Pagamento</p>
                                <Link
                                    href={order.order_payment_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="User_Order_Status_State_Payment_Link"
                                >
                                    Link de Pagamento
                                </Link>
                            </div>
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
                            <p>Aguardando Pagamento</p> <button className="User_Order_Status_State_Payment_Link">Link de Pagamento</button>
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
                </div>

                <a
                    className="User_Order_Status_Call_Btn"
                    href={generate_whatsapp_url_for_more_order_info(order.order_external_reference, businessTelephone)}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="material-icons">support_agent</span> Solicitar Atendimento
                </a>
            </div>

            <button className="Order_Expand_Btn" onClick={() => setIsExpanded(!isExpanded)}>
                <p className="Order_Expand_Btn_Text">Detalhes do Pedido</p>
                <span className={isExpanded ? "material-icons Order_Expand_Btn_Icon Active" : "material-icons Order_Expand_Btn_Icon"}>
                    expand_more
                </span>
            </button>

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
                                            <div className="User_Order_Product_Qtty">
                                                <p>{order_item.quantity}</p>
                                                <span>X</span>
                                            </div>
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

const User_Tab_Orders = () => {
    // Estado para ver mais do que 3 pedidos
    const [seeMore, setSeeMore] = useState(false);

    // Estado para ver os pedidos do usuário
    const orderList = useSelector((state: RootState) => state.user.currentUserOrders);
    const sortedOrders = [...orderList].sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
    const displayedOrders = seeMore ? sortedOrders : sortedOrders.slice(0, 3);
    const noOrders = orderList.length < 1;

    return (
        <>
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
        </>
    );
};

export default User_Tab_Orders;
