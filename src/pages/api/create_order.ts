import { NextApiRequest, NextApiResponse } from "next";

// Firebase Admin SDK
import admin, { ServiceAccount } from "firebase-admin";

import { Order } from "@/types/Order";

if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error("The FIREBASE_PROJECT_ID environment variable is not defined");
}

if (!process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error("The FIREBASE_CLIENT_EMAIL environment variable is not defined");
}

if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("The FIREBASE_PRIVATE_KEY environment variable is not defined");
}

if (!process.env.FIREBASE_PRAGMATA_PROJECT_ID) {
    throw new Error("The FIREBASE_PRAGMATA_PROJECT_ID environment variable is not defined");
}

const serviceAccount: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pragmatas-dev.firebaseio.com",
});

/* Exemplo de Objeto de Pedido para ser enviado no Body da Requisição

const order: CheckoutOrder = {
            orderID: customReference,
            customReference: customReference,
            orderItems: translatedCartItems,
            orderDate: Timestamp.now(),
            orderType: orderType,

            shippingOption: shippingOption || "Retirada",
            shippingCost: Number(shippingCost),
            observation: observation,
            total: cartTotal,

            clientRef: checkoutUser.tropicalID,
            clientType: registeredUser ? "registered" : "anonymous",
            clientName: checkoutUser.name,
            clientAdress: checkoutAdress.street + ", " + checkoutAdress.number + "( " + checkoutAdress.extra + " )" + " - " + checkoutAdress.city,

            status: {
                confirmed: false,
                waitingPayment: false,
                inProduction: false,
                waitingForRetrieval: false,
                waitingForDelivery: false,
                delivered: false,
                cancelled: false,
            },
        };

*/

export default async function orderCreationHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const order_data: Order = req.body;
        console.log("Dados Recebidos para Criar o Pedido:", order_data);

        const firestore = admin.firestore();
        const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID; // UID do Projeto Espefífico no Firebase - Neste Caso a ID do projeto da Tropical Cacau
        const ordersCollectionRef = firestore.collection(`projects/${projectUID}/orders`);

        await ordersCollectionRef.doc(order_data.order_external_reference).set(order_data, { merge: true });

        res.status(200).json({ status: "Order Created!", order_data: order_data }); // Retorna um JSON com o status da criação do pedido | Atuamente não retorna o ID do Pedido
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // Retorna um JSON com o erro de método não permitido
    }
}
