// Axios para requisições HTTP
import axios from "axios";

import { useRef, useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";

import { AnimatePresence, motion as m } from "framer-motion";

import { Order } from "@/types/Order";
import Link from "next/link";

import { generate_whatsapp_url_for_more_order_info, generate_whatsapp_url_for_contacting_client } from "@/util/WhatsApp";

const businessTelephone = process.env.NEXT_PUBLIC_BUSINESS_MAIN_TELEPHONE;

if (!businessTelephone) {
    throw new Error("BUSINESS_MAIN_TELEPHONE environment variable is not defined");
}

// const { userId, orderId, editedOrder }: { userId: string; orderId: string; editedOrder: Order } = req.body;
const UPDATE_SPECIFIC_ORDER_API = process.env.NEXT_PUBLIC_PATH_API_UPDATE_SPECIFIC_ORDER;

if (!UPDATE_SPECIFIC_ORDER_API) {
    throw new Error("NEXT_PUBLIC_PATH_API_UPDATE_SPECIFIC_ORDER environment variable is not defined");
}

// Propriedades do Componente de Pedido
export type OrderItemProps = {
    order: Order;
    index: number;
    order_number: string;
    updateOrder: (updatedOrder: Order) => void;
};

// Componente de Pedido
export const OrderItem: React.FC<OrderItemProps> = ({ order, index, order_number, updateOrder }) => {
    const user = useSelector((state: RootState) => state.user);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedOrder, setEditedOrder] = useState<Order>(order);

    return (
        <m.div className="User_Order_Item Order_Control_Item" key={index} layout transition={{ duration: 0.1 }}>
            <m.div layout key="order_item_header" className="Order_Item_Header">
                <div className="Order_Item_Text_Header_Item">
                    <h4 className="User_Info_Label">Pedido Nº</h4>
                    <p className="User_Order_Number">#{order_number}</p>
                </div>

                <div className="Order_Item_Text_Header_Item">
                    <h4 className="User_Info_Label">Nome do Cliente</h4>
                    <p className="User_Order_Number">{order.customer_name}</p>
                </div>

                <div className="Order_Item_Text_Header_Item">
                    <h4>Valor Total: </h4>
                    <p>
                        R${" "}
                        {order.order_items.reduce((total, order_item) => total + order_item.product.price * order_item.quantity, 0) +
                            order.shipping_cost}
                        ,00
                    </p>
                </div>

                <div className="Order_Item_Text_Header_Item">
                    <h4>Código Identificador</h4>
                    <p>{order.order_external_reference}</p>
                </div>

                <div className="Order_Item_Text_Header_Item">
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
            </m.div>

            <m.div layout key="order_item_status" className="User_Order_Status">
                <h4>Status </h4>
                {Object.values(order.status).every((status) => status === false) && (
                    <>
                        <div className="User_Order_Status_State">
                            <p>Aguardando Pagamento</p>
                            <div className="Subscription_Status_Alert">
                                <span className="material-icons">info</span>
                                <p>O cliente ainda não efetuou o pagamento do pedido ou o Mercado Pago ainda está processando o pedido.</p>
                            </div>
                            <Link
                                href={order.order_payment_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="User_Order_Status_State_Payment_Link"
                            >
                                <span className="material-icons">payment</span> Link de Pagamento
                            </Link>
                        </div>
                    </>
                )}
                {order.status.confirmed_by_admin === true && (
                    <>
                        <div className="User_Order_Status_State">
                            <p></p>
                        </div>
                        <span className="material-icons">hourglass_bottom</span>
                        Confirmado
                    </>
                )}
                {order.status.waiting_payment === true && (
                    <>
                        <div className="User_Order_Status_State">
                            <p>Aguardando Pagamento</p>
                            <div className="Subscription_Status_Alert">
                                <span className="material-icons">info</span>
                                <p>O cliente ainda não efetuou o pagamento do pedido, ou o Mercado Pago ainda está processando o pagamento.</p>
                            </div>
                            <Link
                                href={order.order_payment_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="User_Order_Status_State_Payment_Link"
                            >
                                <span className="material-icons">payment</span> Link de Pagamento
                            </Link>
                        </div>
                    </>
                )}
                {order.status.in_production === true && (
                    <>
                        <div className="User_Order_Status_State">
                            <p>Em Produção</p>
                        </div>
                    </>
                )}
                {order.status.waiting_for_retrieval === true && (
                    <>
                        <div className="User_Order_Status_State">
                            <p>Aguardando Retirada</p>
                        </div>
                    </>
                )}
                {order.status.retrieved === true && (
                    <>
                        <div className="User_Order_Status_State">
                            <p>Retirado no Balcão</p>
                        </div>
                    </>
                )}
                {order.status.waiting_for_delivery === true && (
                    <>
                        <div className="User_Order_Status_State">
                            <p>Aguardando Entrega</p>
                        </div>
                    </>
                )}
                {order.status.delivered === true && (
                    <>
                        <div className="User_Order_Status_State">
                            <p>Entregue</p>
                        </div>
                    </>
                )}
                {order.status.cancelled === true && (
                    <>
                        <div className="User_Order_Status_State">
                            <p>Cancelado</p>
                        </div>
                    </>
                )}
            </m.div>

            <m.div layout key="order_item_actions" className="User_Order_Actions">
                <m.a
                    className="User_Order_Status_Call_Btn"
                    href={generate_whatsapp_url_for_contacting_client(order.customer_name, order.customer_phone)}
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
                            <p className="User_Order_Change_Status_Btn_Text">Alterar Status do Pedido</p>
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
                                    className={`User_Order_Edit_Status_Option ${editedOrder.status.waiting_payment ? "Active" : ""} ${
                                        order.status.waiting_payment ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedOrder((currentOrder) => ({
                                            ...currentOrder,
                                            status: {
                                                ...currentOrder.status,
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
                                    className={`User_Order_Edit_Status_Option ${editedOrder.status.confirmed_by_admin ? "Active" : ""} ${
                                        order.status.confirmed_by_admin ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedOrder((currentOrder) => ({
                                            ...currentOrder,
                                            status: {
                                                ...currentOrder.status,
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
                                    className={`User_Order_Edit_Status_Option ${editedOrder.status.in_production ? "Active" : ""} ${
                                        order.status.in_production ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedOrder((currentOrder) => ({
                                            ...currentOrder,
                                            status: {
                                                ...currentOrder.status,
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
                                    Em Produção
                                </button>
                                <button
                                    className={`User_Order_Edit_Status_Option ${editedOrder.status.waiting_for_retrieval ? "Active" : ""} ${
                                        order.status.waiting_for_retrieval ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedOrder((currentOrder) => ({
                                            ...currentOrder,
                                            status: {
                                                ...currentOrder.status,
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
                                    className={`User_Order_Edit_Status_Option ${editedOrder.status.retrieved ? "Active" : ""} ${
                                        order.status.retrieved ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedOrder((currentOrder) => ({
                                            ...currentOrder,
                                            status: {
                                                ...currentOrder.status,
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
                                    className={`User_Order_Edit_Status_Option ${editedOrder.status.waiting_for_delivery ? "Active" : ""} ${
                                        order.status.waiting_for_delivery ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedOrder((currentOrder) => ({
                                            ...currentOrder,
                                            status: {
                                                ...currentOrder.status,
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
                                    className={`User_Order_Edit_Status_Option ${editedOrder.status.delivered ? "Active" : ""} ${
                                        order.status.delivered ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedOrder((currentOrder) => ({
                                            ...currentOrder,
                                            status: {
                                                ...currentOrder.status,
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
                                    className={`User_Order_Edit_Status_Option ${editedOrder.status.cancelled ? "Active" : ""} ${
                                        order.status.cancelled ? "Actual" : ""
                                    }`}
                                    onClick={() => {
                                        setEditedOrder((currentOrder) => ({
                                            ...currentOrder,
                                            status: {
                                                ...currentOrder.status,
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
                                            `${UPDATE_SPECIFIC_ORDER_API}`,
                                            { userId: user.currentUser?.id, orderId: order.order_external_reference, editedOrder },
                                            {
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                            }
                                        );
                                        if (response.data.error) {
                                            console.error(response.data.error);
                                        } else {
                                            console.log(response.data.order_data);
                                            updateOrder(response.data.order_data as Order);
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
                                    setEditedOrder(order);
                                }}
                            >
                                Cancelar Alterações
                            </button>
                        </m.div>
                    )}
                </AnimatePresence>

                <m.button layout key="order_expand_btn" className="Order_Expand_Btn" onClick={() => setIsExpanded(!isExpanded)}>
                    <span className={isExpanded ? "material-icons Order_Expand_Btn_Icon Active" : "material-icons Order_Expand_Btn_Icon"}>
                        expand_more
                    </span>
                    <p className="Order_Expand_Btn_Text">Detalhes do Pedido</p>
                </m.button>
            </m.div>

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

                            {order.shipping_option === "Entrega" && (
                                <m.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                                    className="User_Order_Control_Shipping_Info"
                                >
                                    <h4>Informações de Entrega</h4>
                                    <p>{order.customer_adress}</p>
                                </m.div>
                            )}
                        </m.div>
                    </>
                )}
            </AnimatePresence>
        </m.div>
    );
};

const NEXT_PUBLIC_PATH_API_GET_ALL_ORDERS = process.env.NEXT_PUBLIC_PATH_API_GET_ALL_ORDERS;

interface OrderStatus {
    [key: string]: boolean;
    confirmed_by_admin: boolean;
    waiting_payment: boolean;
    in_production: boolean;
    waiting_for_retrieval: boolean;
    retrieved: boolean;
    waiting_for_delivery: boolean;
    delivered: boolean;
    cancelled: boolean;
}

const OrderControl = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [orders, setOrders] = useState<Order[]>([]);

    const [viewMode, setViewMode] = useState<"list" | "grid" | "fullscreen">("grid");

    const sortedOrders = [...orders].sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());

    const [orderShippingOption, setOrderShippingOption] = useState("");
    const [orderStatus, setOrderStatus] = useState<OrderStatus>({
        confirmed_by_admin: false,
        waiting_payment: false,
        in_production: false,
        waiting_for_retrieval: false,
        retrieved: false,
        waiting_for_delivery: false,
        delivered: false,
        cancelled: false,
    });

    const allStatusFalse = Object.values(orderStatus).every((status) => status === false);

    const [dateRange, setDateRange] = useState("Todos os Pedidos");
    const [customerName, setCustomerName] = useState("");
    const [orderReference, setOrderReference] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");

    const applyFilters = () => {
        // Helper function to get start and end dates based on dateRange
        const getDateRange = (range: string) => {
            const today = new Date();
            let startDate = new Date();
            let endDate = new Date();

            switch (range) {
                case "Hoje":
                    startDate.setHours(0, 0, 0, 0);
                    endDate.setHours(23, 59, 59, 999);
                    break;
                case "Ontem":
                    startDate.setDate(today.getDate() - 1);
                    startDate.setHours(0, 0, 0, 0);
                    // Set endDate to the end of yesterday
                    endDate = new Date(startDate);
                    endDate.setHours(23, 59, 59, 999);
                    break;
                case "Últimos 7 dias":
                    startDate.setDate(today.getDate() - 7);
                    startDate.setHours(0, 0, 0, 0);
                    endDate.setHours(23, 59, 59, 999); // Ensure endDate is end of today
                    break;
                case "Últimos 30 dias":
                    startDate.setDate(today.getDate() - 30);
                    startDate.setHours(0, 0, 0, 0);
                    endDate.setHours(23, 59, 59, 999); // Ensure endDate is end of today
                    break;
                case "Últimos 90 dias":
                    startDate.setDate(today.getDate() - 90);
                    startDate.setHours(0, 0, 0, 0);
                    endDate.setHours(23, 59, 59, 999); // Ensure endDate is end of today
                    break;
                case "Este mês":
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
                    break;
                case "Mês passado":
                    startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    endDate = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
                    break;
                case "Este ano":
                    startDate = new Date(today.getFullYear(), 0, 1);
                    endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
                    break;
                case "Todos os Pedidos":
                    startDate = new Date(0); // Set to a very early date
                    endDate = new Date(); // Set to current date and time
                    endDate.setHours(23, 59, 59, 999); // Ensure it includes today's orders
                    break;
                case "":
                    startDate = new Date(0); // Set to a very early date
                    endDate = new Date(); // Set to current date and time
                    endDate.setHours(23, 59, 59, 999); // Ensure it includes today's orders
                    break;
                default:
                    // Handle default case or custom date ranges if applicable
                    break;
            }

            return { startDate, endDate };
        };

        const { startDate, endDate } = getDateRange(dateRange);

        return sortedOrders.filter((order) => {
            const orderDate = new Date(order.order_date);
            const isDateMatch = orderDate >= startDate && orderDate <= endDate;

            // Your existing filter conditions here, add `isDateMatch` to the conditions
            const isStatusMatch = Object.keys(order.status).some((statusKey) => {
                return (order.status as { [key: string]: boolean })[statusKey] && orderStatus[statusKey];
            });

            return (
                isDateMatch &&
                (orderShippingOption ? order.shipping_option === orderShippingOption : true) &&
                (isStatusMatch || Object.values(orderStatus).every((v) => !v)) &&
                (customerName ? order.customer_name.toLowerCase().includes(customerName.toLowerCase().trim()) : true) &&
                (orderReference ? order.order_external_reference.toLowerCase().includes(orderReference.toLowerCase().trim()) : true) &&
                (deliveryAddress ? order.customer_adress.toLowerCase().includes(deliveryAddress.toLowerCase().trim()) : true)
            );
        });
    };

    const filteredOrders = applyFilters();

    function updateOrderInList(updatedOrder: Order) {
        const ordersCopy = [...orders];
        const orderIndex = ordersCopy.findIndex((order) => order.order_external_reference === updatedOrder.order_external_reference);

        console.log("Updating order with external reference:", updatedOrder.order_external_reference); // Log the reference you're trying to update
        console.log(
            "Available external references in orders:",
            ordersCopy.map((o) => o.order_external_reference)
        ); // Log all available references

        if (orderIndex !== -1) {
            ordersCopy[orderIndex] = updatedOrder;
            setOrders(ordersCopy);
        } else {
            console.log("Error updating order. Order with the given external reference not found.");
        }
    }

    const fetchOrders = async () => {
        try {
            const response = await axios.post(
                `${NEXT_PUBLIC_PATH_API_GET_ALL_ORDERS}`,
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
                setOrders(response.data as Order[]);
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
            fetchOrders();
        } else {
            setOrders([]);
        }
    }, [user.currentUser]);

    return (
        <div className="Order_Control_Card">
            <h2 className="Order_Control_Title">Controle de Pedidos</h2>

            <div className="Order_Control_Filter">
                <h2 className="Order_Control_Filter_Title">Filtro de Pedidos</h2>

                <div className="Order_Control_Filter_Buttons">
                    <div className="Order_Control_Filter_Item">
                        <h4>
                            <span className="material-icons">local_shipping</span>Tipo de Recebimento
                        </h4>
                        <div className={"Order_Control_Filter_Options"}>
                            <button
                                className={orderShippingOption === "Entrega" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderShippingOption(orderShippingOption === "Entrega" ? "" : "Entrega");
                                }}
                            >
                                Entrega
                            </button>
                            <button
                                className={orderShippingOption === "Retirada" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderShippingOption(orderShippingOption === "Retirada" ? "" : "Retirada");
                                }}
                            >
                                Retirada
                            </button>
                            <button
                                className={orderShippingOption === "" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderShippingOption("");
                                }}
                            >
                                Todos os Tipos
                            </button>
                        </div>
                    </div>

                    <div className="Order_Control_Filter_Item">
                        <h4>
                            <span className="material-icons">published_with_changes</span>Status
                        </h4>
                        <div className="Order_Control_Filter_Options">
                            <button
                                className={orderStatus.waiting_payment ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderStatus((currentStatus) => ({
                                        ...currentStatus,
                                        waiting_payment: !currentStatus.waiting_payment,
                                    }));
                                }}
                            >
                                Aguardando Pagamento
                            </button>
                            <button
                                className={orderStatus.confirmed_by_admin ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderStatus((currentStatus) => ({
                                        ...currentStatus,
                                        confirmed_by_admin: !currentStatus.confirmed_by_admin,
                                    }));
                                }}
                            >
                                Confirmado
                            </button>
                            <button
                                className={orderStatus.in_production ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderStatus((currentStatus) => ({
                                        ...currentStatus,
                                        in_production: !currentStatus.in_production,
                                    }));
                                }}
                            >
                                Em Produção
                            </button>
                            <button
                                className={orderStatus.waiting_for_retrieval ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderStatus((currentStatus) => ({
                                        ...currentStatus,
                                        waiting_for_retrieval: !currentStatus.waiting_for_retrieval,
                                    }));
                                }}
                            >
                                Aguardando Retirada
                            </button>
                            <button
                                className={orderStatus.retrieved ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderStatus((currentStatus) => ({
                                        ...currentStatus,
                                        retrieved: !currentStatus.retrieved,
                                    }));
                                }}
                            >
                                Retirado no Balcão
                            </button>
                            <button
                                className={orderStatus.waiting_for_delivery ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderStatus((currentStatus) => ({
                                        ...currentStatus,
                                        waiting_for_delivery: !currentStatus.waiting_for_delivery,
                                    }));
                                }}
                            >
                                Aguardando Entrega
                            </button>
                            <button
                                className={orderStatus.delivered ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderStatus((currentStatus) => ({
                                        ...currentStatus,
                                        delivered: !currentStatus.delivered,
                                    }));
                                }}
                            >
                                Entregue
                            </button>
                            <button
                                className={orderStatus.cancelled ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderStatus((currentStatus) => ({
                                        ...currentStatus,
                                        cancelled: !currentStatus.cancelled,
                                    }));
                                }}
                            >
                                Cancelado
                            </button>

                            <button
                                className={allStatusFalse ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setOrderStatus((currentStatus) => ({
                                        ...currentStatus,
                                        waiting_payment: false,
                                        confirmed_by_admin: false,
                                        in_production: false,
                                        waiting_for_retrieval: false,
                                        retrieved: false,
                                        waiting_for_delivery: false,
                                        delivered: false,
                                        cancelled: false,
                                    }));
                                }}
                            >
                                Qualquer Status
                            </button>
                        </div>
                    </div>

                    <div className="Order_Control_Filter_Item">
                        <h4>
                            <span className="material-icons">calendar_month</span>Data do Pedido
                        </h4>
                        <div className="Order_Control_Filter_Options">
                            <button
                                className={dateRange === "Hoje" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setDateRange("Hoje");
                                }}
                            >
                                Hoje
                            </button>
                            <button
                                className={dateRange === "Ontem" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setDateRange("Ontem");
                                }}
                            >
                                Ontem
                            </button>
                            <button
                                className={dateRange === "Últimos 7 dias" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setDateRange("Últimos 7 dias");
                                }}
                            >
                                Últimos 7 dias
                            </button>
                            <button
                                className={dateRange === "Últimos 30 dias" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setDateRange("Últimos 30 dias");
                                }}
                            >
                                Últimos 30 dias
                            </button>
                            <button
                                className={dateRange === "Últimos 90 dias" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setDateRange("Últimos 90 dias");
                                }}
                            >
                                Últimos 90 dias
                            </button>
                            <button
                                className={dateRange === "Este mês" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setDateRange("Este mês");
                                }}
                            >
                                Este mês
                            </button>
                            <button
                                className={dateRange === "Mês passado" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setDateRange("Mês passado");
                                }}
                            >
                                Mês passado
                            </button>
                            <button
                                className={dateRange === "Este ano" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setDateRange("Este ano");
                                }}
                            >
                                Este ano
                            </button>
                            <button
                                className={dateRange === "Todos os Pedidos" ? "Order_Control_Filter_Option Active" : "Order_Control_Filter_Option"}
                                onClick={() => {
                                    setDateRange("Todos os Pedidos");
                                }}
                            >
                                Todos os Pedidos
                            </button>
                        </div>
                    </div>
                </div>

                <div className="Order_Control_Filter_Inputs">
                    <div className="Order_Control_Filter_Item">
                        <h4>
                            <span className="material-icons">account_circle</span>Nome do Cliente
                        </h4>
                        <input
                            type="text"
                            placeholder="Nome do Cliente"
                            onChange={(e) => {
                                setCustomerName(e.target.value);
                            }}
                        />
                    </div>

                    <div className="Order_Control_Filter_Item">
                        <h4>
                            <span className="material-icons">qr_code_2</span>Código de Pedido
                        </h4>
                        <input
                            type="text"
                            placeholder="Código de Pedido"
                            onChange={(e) => {
                                setOrderReference(e.target.value);
                            }}
                        />
                    </div>

                    <div className="Order_Control_Filter_Item">
                        <h4>
                            <span className="material-icons">markunread_mailbox</span>Endereço de Entrega
                        </h4>
                        <input
                            type="text"
                            placeholder="Endereço de Entrega"
                            onChange={(e) => {
                                setDeliveryAddress(e.target.value);
                            }}
                        />
                    </div>

                    <div className="Order_Conrol_Filter_ViewModes Non_Mobile_Only">
                        <h4>
                            <span className="material-icons">visibility</span>Modos de Visualização
                        </h4>

                        <div className={"ViewModes_Items"}>
                            <button
                                className={viewMode === "list" ? "Order_Control_Filter_ViewMode Active" : "Order_Control_Filter_ViewMode"}
                                onClick={() => {
                                    setViewMode("list");
                                }}
                            >
                                <span className="material-icons">view_list</span>Lista
                            </button>
                            <button
                                className={viewMode === "grid" ? "Order_Control_Filter_ViewMode Active" : "Order_Control_Filter_ViewMode"}
                                onClick={() => {
                                    setViewMode("grid");
                                }}
                            >
                                <span className="material-icons">view_module</span>Grid
                            </button>
                            <button
                                className={viewMode === "fullscreen" ? "Order_Control_Filter_ViewMode Active" : "Order_Control_Filter_ViewMode"}
                                onClick={() => {
                                    setViewMode("fullscreen");
                                }}
                            >
                                <span className="material-icons">panorama_wide_angle</span>Tela Cheia
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <m.div className={"Order_Control_List " + viewMode}>
                {filteredOrders.map((order, index) => (
                    <OrderItem
                        key={order.order_external_reference}
                        order={order}
                        index={index}
                        order_number={`${index}`}
                        updateOrder={updateOrderInList}
                    />
                ))}
            </m.div>
        </div>
    );
};

export default OrderControl;