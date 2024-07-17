import { NextApiRequest, NextApiResponse } from "next";
import { Order } from "@/types/Order";

import { auth, firestore } from "@/lib/firebaseAdmin";

// orders_counter e subscriptions_counter
type Counter = {
    total_ammount: number;
};

/* Original Order Data Structure

const order: Order = {
    order_preference_id: new_preference.id || "error-generating-id",
    order_external_reference: new_preference.external_reference || "default_reference",
    order_serial_number: 0,
    order_payment_link: new_preference.full_preference.init_point || "default_payment_link",
    order_items: cartItems,
    order_date: new Date(),
    order_type: "mercado-pago",

    shipping_option: receiveOption,
    shipping_cost: shipping_cost,
    observation: receiveObservation,
    total: cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) + shipping_cost,

    customer_ref: customer.id,
    customer_type: "web-client",
    customer_name: customer.name,
    customer_adress: `${customer.address.street}, ${customer.address.number}, ${customer.address.complement}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zip}`,
    customer_phone: customer.telephone,

    status: {
        confirmed_by_admin: false,
        waiting_payment: true,
        in_production: false,
        waiting_for_retrieval: false,
        retrieved: false,
        waiting_for_delivery: false,
        delivered: false,
        cancelled: false,
    },
};

*/

/* customer, new_preference, cartItems, order_type, shipping_option, observation  */

/*  Order Creation Data Structure

    const create_order_data = {
        customer: customer,
        new_preference: new_preference,
        cartItems: cartItems,
        order_type: "mercado-pago",
        receiveOption: receiveOption,
        observation: receiveObservation,
    };

*/

export default async function orderCreationHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID; // UID do Projeto Espefífico no Firebase - Neste Caso a ID do projeto da Tropical Cacau

        const counterDocRef = firestore.collection(`projects/${projectUID}/counters`).doc("orders_counter"); // orders_counter e subscriptions_counter
        const counterDoc = await counterDocRef.get();
        const counter = counterDoc.data();

        if (!counter || !counterDoc.exists) {
            return res.status(404).json({ error: "Counter not found" });
        }

        const order_data = req.body;
        // importar tipos de cada um destes elementos!
        const { customer, new_preference, cartItems, order_type, receiveOption, observation } = order_data;
        // console.log("Dados Recebidos para Criar o Pedido:", order_data);

        const newShippingCost = receiveOption === "Retirada" ? 0 : 15;

        const newOrder: Order = {
            order_preference_id: new_preference.id || "error-generating-id",
            order_external_reference: new_preference.external_reference || "default_reference",
            order_serial_number: counter.total_ammount,
            order_payment_link: new_preference.full_preference.init_point || "default_payment_link",
            order_items: cartItems,
            order_date: new Date().toISOString(),
            order_type: order_type,

            shipping_option: receiveOption,
            shipping_cost: newShippingCost,
            observation: observation,
            total: cartItems.reduce((acc: any, item: any) => acc + item.product.price * item.quantity, 0) + newShippingCost,

            customer_ref: customer.id,
            customer_type: "web-client",
            customer_name: customer.name,
            customer_adress: `${customer.address.street}, ${customer.address.number}, ${customer.address.complement}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zip}`,
            customer_phone: customer.telephone,

            status: {
                confirmed_by_admin: false,
                waiting_payment: true,
                in_production: false,
                waiting_for_retrieval: false,
                retrieved: false,
                waiting_for_delivery: false,
                delivered: false,
                cancelled: false,
            },
        };

        const ordersCollectionRef = firestore.collection(`projects/${projectUID}/orders`);

        await ordersCollectionRef.doc(newOrder.order_external_reference).set(newOrder, { merge: true });

        const newCounterValue: Counter = {
            total_ammount: counter.total_ammount + 1,
        };

        await counterDocRef.set(newCounterValue, { merge: true });

        res.status(200).json({ status: "Order Created!", order_data: newOrder, counter_data: newCounterValue }); // Retorna um JSON com o status da criação do pedido | Atuamente não retorna o ID do Pedido
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // Retorna um JSON com o erro de método não permitido
    }
}
