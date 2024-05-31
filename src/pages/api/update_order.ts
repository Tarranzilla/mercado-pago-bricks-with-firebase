import { NextApiRequest, NextApiResponse } from "next";

// Firebase Admin SDK
import admin, { ServiceAccount } from "firebase-admin";

// Biblioteca de Criptografia
import crypto from "crypto";

// Axios para requisições HTTP
import axios, { AxiosError } from "axios";

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

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACESS_TOKEN;
const secret = process.env.MERCADO_PAGO_WEBHOOK_TEST_KEY;

export default async function orderUpdateHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { body, headers } = req;

        /* Exemplo de corpo (body) de uma notificação recebida do Mercado Pago

        {

            action: "payment.update",                     // Tipo de notificação recebida, indicando se se trata da atualização de um recurso ou da criação de um novo
            api_version: "v1",
            data: {"id":"123456"},
            date_created: "2021-11-01T02:02:02Z",
            id: "123456",                                 // UserID da notificação
            live_mode: false,
            type: "payment",                              // Tipo de notificação
            user_id: 201803820                            // UserID de vendedor

        }

        */

        if (typeof headers["x-signature"] === "string") {
            // Exemplo do conteúdo enviado no header x-signature
            // ts=1704908010,v1=618c85345248dd820d5fd456117c2ab2ef8eda45a0282ff693eac24131a5e839

            const [ts, signature] = headers["x-signature"].split(",");
            console.log("ts:", ts);
            console.log("signature:", signature);

            const tsValue = ts.split("=")[1];
            const signatureValue = signature.split("=")[1];

            // Criar um template com os dados recebidos na notificação
            // id:[data.id_url];request-id:[x-request-id_header];ts:[ts_header];

            const signatureTemplate = `id:${body.data.id};request-id:${headers["x-request-id"]};ts:${tsValue};`;
            console.log("signatureTemplate:", signatureTemplate);

            if (typeof secret === "string") {
                const generatedSignature = crypto.createHmac("sha256", secret).update(signatureTemplate).digest("hex");

                // Comparar a chave gerada com a chave extraída do cabeçalho
                if (signatureValue === generatedSignature) {
                    // A assinatura é válida, agora você pode processar os dados e salvá-los no Firebase
                    const firestore = admin.firestore();
                    const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;
                    const ordersCollectionRef = firestore.collection(`projects/${projectUID}/orders`);

                    /*
                    
                    Depois de dar um retorno à notificação e confirmar o seu recebimento, você obterá as informações completas do recurso 
                    notificado acessando o endpoint correspondente da API:

                    payment - https://api.mercadopago.com/v1/payments/[ID]

                    */

                    switch (body.type) {
                        case "payment":
                            // Handle payment notification
                            const payment_id = body.data.id;
                            const payment_info = body.data;
                            const action = body.action;
                            const action_id = body.id;
                            const action_date = body.date_created;
                            const vendor_id = body.user_id;

                            const paymentData = {
                                payment_id: payment_id,
                                payment_info: payment_info,
                                action: action,
                                action_id: action_id,
                                action_date: action_date,
                                vendor_id: vendor_id,
                            };

                            try {
                                const fullPaymentInfo = await axios.get(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
                                    },
                                });

                                if (fullPaymentInfo.data) {
                                    console.log(fullPaymentInfo.data);

                                    const orderData = {
                                        mp_payment_status: paymentData,
                                        full_mp_payment_info: fullPaymentInfo.data,
                                    };

                                    const orderUID = fullPaymentInfo.data.external_reference;
                                    console.log("Order UID | EXTERNAL REFERENCE:", orderUID);

                                    await ordersCollectionRef.doc(orderUID).set(orderData, { merge: true });
                                }

                                // Rest of your code...
                            } catch (error) {
                                const axiosError = error as AxiosError; // Type assertion here

                                if (axiosError.response && axiosError.response.status === 404) {
                                    console.error("Payment not found:", payment_id);
                                } else {
                                    console.error("An error occurred:", axiosError);
                                }
                            }
                            break;
                        case "plan":
                            // Handle plan notification
                            // Example: const plan = body.data;
                            break;
                        case "subscription":
                            // Handle subscription notification
                            // Example: const subscription = body.data;
                            break;
                        // Add more cases for other notification types as needed
                        default:
                            // Unknown notification type
                            // Log or handle the error
                            console.error("Unknown notification type:", body.type);
                            break;
                    }

                    // Responder ao Mercado Pago (se necessário)
                    res.status(200).json({ success: true });
                } else {
                    // A assinatura é inválida
                    console.log("Nasty Bug, Invalid Signature");
                    res.status(500).json({ error: `Invalid Signature | ${secret}` });
                }
            } else {
                // handle the case where secret is undefined
                console.log("Nasty Bug, Undefined Secret");
                res.status(500).json({ error: "Internal Server Error - Undefined secret" });
            }
        } else {
            // Método não permitido
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } else {
        // handle the case where headers['x-signature'] is an array of strings
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
