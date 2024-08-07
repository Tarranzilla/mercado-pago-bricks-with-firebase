import { Cart_Item } from "./Cart_Item";

export type Order = {
    order_preference_id: string;
    order_external_reference: string;
    order_serial_number: number;
    order_payment_link: string;
    order_items: Cart_Item[];
    order_date: string;
    order_type: string;

    shipping_option: string;
    shipping_cost: number;
    observation: string;
    total: number;

    customer_ref: string;
    customer_type: string;
    customer_name: string;
    customer_adress: string;
    customer_phone: string;

    status: {
        confirmed_by_admin: boolean;
        waiting_payment: boolean;
        in_production: boolean;
        waiting_for_retrieval: boolean;
        retrieved: boolean;
        waiting_for_delivery: boolean;
        delivered: boolean;
        cancelled: boolean;
    };
}; // Definição do tipo de Pedido
