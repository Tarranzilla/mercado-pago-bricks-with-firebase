export type Subscription = {
    subscription_preference_id: string;
    subscription_external_reference: string;
    subscription_payment_link: string;

    subscription_id: string;
    subscription_name: string;
    subscription_date: Date;
    subscription_duration: number;
    subscription_type: string;

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
