import { NextApiRequest, NextApiResponse } from "next";
import { Subscription } from "@/types/Subscription";
import { User } from "@/types/User";

import { auth, firestore } from "@/lib/firebaseAdmin";

type createSubscriptionPreferenceRequest = {
    plan_id: string;
    plan_name: string;
    duration: number;
    start_date: string;
};

type createSubscriptionPreferenceResponse = {
    id: string;
    external_reference: string;
    full_preference: any;
};

type New_Subscription_Data = {
    customer: User;
    new_preference: createSubscriptionPreferenceResponse;
    subscription: createSubscriptionPreferenceRequest;
};

/*  Subscription Data Structure

    const new_subscription: Subscription = {
        subscription_preference_id: new_subscription_preference.id || "error-generating-id",
        subscription_external_reference: new_subscription_preference.external_reference || "default_reference",
        subscription_payment_link: new_subscription_preference.full_preference.init_point || "default_payment_link",

        subscription_id: "tropical-clube-3-meses",
        subscription_name: "Assinatura Clube Tropical 3 Meses",
        subscription_date: new Date(),
        subscription_duration: 3,
        subscription_type: "mercado-pago",

        total: 3 * 120,

        customer_ref: customer.id,
        customer_type: "web-client",
        customer_name: customer.name,
        customer_adress: `${customer.address.street}, ${customer.address.number}, ${customer.address.complement}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zip}`,
        customer_phone: customer.telephone,

        status: {
            confirmed_by_admin: false,
            waiting_payment: false,
            in_production: false,
            waiting_for_retrieval: false,
            retrieved: false,
            waiting_for_delivery: false,
            delivered: false,
            cancelled: false,
        },
    };
*/

/* Subscription Creation Data Structure

    const updatedCustomer = {
        ...customer,
        subscriptions: [...customer.subscriptions, subscription.subscription_data.subscription_external_reference],
        isSubscriber: true,
    };

    fetch(updateUserAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCustomer),
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`User Update Failed! HTTP Error: ${response.status}`);
        } 
    });

*/

export default async function subscriptionCreationHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID; // UID do Projeto Espefífico no Firebase - Neste Caso a ID do projeto da Tropical Cacau

        const counterDocRef = firestore.collection(`projects/${projectUID}/counters`).doc("subscriptions_counter"); // orders_counter e subscriptions_counter
        const counterDoc = await counterDocRef.get();
        const counter = counterDoc.data();

        if (!counter || !counterDoc.exists) {
            return res.status(404).json({ error: "Counter not found" });
        }

        const subscription_data: New_Subscription_Data = req.body;
        const { customer, new_preference, subscription } = subscription_data;

        const subscriptionsCollectionRef = firestore.collection(`projects/${projectUID}/subscriptions`);

        const new_subscription: Subscription = {
            subscription_preference_id: new_preference.id || "error-generating-id",
            subscription_external_reference: new_preference.external_reference || "default_reference",
            subscription_payment_link: new_preference.full_preference.init_point || "default_payment_link",

            subscription_id: subscription.plan_id,
            subscription_serial_number: counter.total_ammount,
            subscription_name: subscription.plan_name,
            subscription_date: new Date().toISOString(),
            subscription_duration: subscription.duration,
            subscription_type: "mercado-pago",

            total: subscription.duration * 120,

            customer_ref: customer.id,
            customer_type: "web-client",
            customer_name: customer.name,
            customer_adress: `${customer.address.street}, ${customer.address.number}, ${customer.address.complement}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zip}`,
            customer_phone: customer.telephone,

            status: {
                waiting_payment: true,
                confirmed_by_admin: false,
                in_production: false,
                waiting_for_retrieval: false,
                retrieved: false,
                waiting_for_delivery: false,
                delivered: false,
                cancelled: false,
            },
        };

        await subscriptionsCollectionRef.doc(new_subscription.subscription_external_reference).set(new_subscription, { merge: true });

        const usersCollectionRef = firestore.collection(`projects/${projectUID}/users`);
        const userDocRef = usersCollectionRef.doc(customer.id);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = userDoc.data();
        if (!userData) {
            return res.status(404).json({ error: "User data not found" });
        }

        const userSubscriptions = userData.subscriptions;
        const newUserSubscriptions = [...userSubscriptions, new_subscription.subscription_external_reference];
        await userDocRef.set({ subscriptions: newUserSubscriptions, isSubscriber: true }, { merge: true });

        const newCounterValue = {
            total_ammount: counter.total_ammount + 1,
        };

        await counterDocRef.set(newCounterValue, { merge: true });

        res.status(200).json({ status: "Subscription Created!", subscription_data: new_subscription }); // Retorna um JSON com o status da criação do pedido | Atuamente não retorna o ID do Pedido
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // Retorna um JSON com o erro de método não permitido
    }
}
