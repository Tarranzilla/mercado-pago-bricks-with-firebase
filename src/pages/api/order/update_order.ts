import { NextApiRequest, NextApiResponse } from "next";

// Firebase Admin SDK
import { firestore, auth } from "@/lib/firebaseAdmin";

// Biblioteca de Criptografia
import crypto from "crypto";

// Axios para requisições HTTP
import axios, { AxiosError } from "axios";

import { Order } from "@/types/Order";

// Verifica se a aplicação está em produção
const isProduction = process.env.IS_PRODUCTION === "true";

const MP_ACCESS_TOKEN = isProduction ? process.env.MP_PROD_ACCESS_TOKEN : process.env.MP_DEV_ACCESS_TOKEN;
const secret = isProduction ? process.env.MP_PROD_WEBHOOK_KEY : process.env.MP_DEV_WEBHOOK_KEY;

export default async function orderUpdateHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { body, headers } = req;
        console.log("Request Body =>", body);
        console.log("Request Headers =>", headers);

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

        if (body.data && typeof headers["x-signature"] === "string") {
            // Exemplo do conteúdo enviado no header x-signature
            // ts=1704908010,v1=618c85345248dd820d5fd456117c2ab2ef8eda45a0282ff693eac24131a5e839

            const [ts, signature] = headers["x-signature"].split(",");
            console.log("ts:", ts);
            console.log("signature:", signature);

            const tsValue = ts.split("=")[1];
            const signatureValue = signature.split("=")[1];

            // Criar um template com os dados recebidos na notificação
            // id:[data.id_url];request-id:[x-request-id_header];ts:[ts_header];
            console.log("body =>", body);
            console.log("body.type =>", body.type);
            console.log("body.data =>", body.data);

            const signatureTemplate = `id:${body.data.id};request-id:${headers["x-request-id"]};ts:${tsValue};`;
            console.log("signatureTemplate:", signatureTemplate);

            if (typeof secret === "string") {
                const generatedSignature = crypto.createHmac("sha256", secret).update(signatureTemplate).digest("hex");

                // Comparar a chave gerada com a chave extraída do cabeçalho
                if (signatureValue === generatedSignature) {
                    // A assinatura é válida, agora você pode processar os dados e salvá-los no Firebase
                    const projectUID = process.env.FIREBASE_PRAGMATA_PROJECT_ID;
                    const ordersCollectionRef = firestore.collection(`projects/${projectUID}/orders`);
                    const subscriptionsCollectionRef = firestore.collection(`projects/${projectUID}/subscriptions`);

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

                            try {
                                const fullPaymentInfo = await axios.get(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
                                    },
                                });

                                if (fullPaymentInfo.data) {
                                    console.log(fullPaymentInfo.data);

                                    const paymentData = {
                                        payment_id: payment_id,
                                        payment_info: payment_info,
                                        payment_info_full: fullPaymentInfo.data,
                                        action: action,
                                        action_id: action_id,
                                        action_date: action_date,
                                        vendor_id: vendor_id,
                                    };

                                    let orderData;

                                    if (fullPaymentInfo.data.status === "approved") {
                                        orderData = {
                                            mp_payment_status: fullPaymentInfo.data.status,
                                            mp_payment_info: paymentData,
                                            status: {
                                                confirmed_by_admin: false,
                                                waiting_payment: false,
                                                in_production: true,
                                                waiting_for_retrieval: false,
                                                retrieved: false,
                                                waiting_for_delivery: false,
                                                delivered: false,
                                                cancelled: false,
                                            },
                                        };
                                    } else {
                                        orderData = {
                                            mp_payment_status: fullPaymentInfo.data.status,
                                            mp_payment_info: paymentData,
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
                                    }

                                    const orderUID = fullPaymentInfo.data.external_reference;
                                    // console.log("Order UID | EXTERNAL REFERENCE:", orderUID);

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
                            const subscription_id = body.data.id;
                            console.log("Subscription ID:", subscription_id);
                            try {
                                const fullSubscriptionPaymentInfo = await axios.get(`https://api.mercadopago.com/v1/payments/${subscription_id}`, {
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
                                    },
                                });

                                if (fullSubscriptionPaymentInfo.data) {
                                    console.log(fullSubscriptionPaymentInfo.data);

                                    const new_subscription = {
                                        subscription_id: subscription_id,
                                        subscription_info: fullSubscriptionPaymentInfo.data,
                                    };

                                    let subscription_data;

                                    if (fullSubscriptionPaymentInfo.data.status === "approved") {
                                        subscription_data = {
                                            mp_subscription_status: fullSubscriptionPaymentInfo.data.status,
                                            mp_subscription_payment_info: new_subscription,
                                            status: {
                                                confirmed_by_admin: false,
                                                waiting_payment: false,
                                                in_production: true,
                                                waiting_for_retrieval: false,
                                                retrieved: false,
                                                waiting_for_delivery: false,
                                                delivered: false,
                                                cancelled: false,
                                            },
                                        };
                                    } else {
                                        subscription_data = {
                                            mp_payment_status: fullSubscriptionPaymentInfo.data.status,
                                            mp_payment_info: new_subscription,
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
                                    }

                                    const orderUID = fullSubscriptionPaymentInfo.data.external_reference;
                                    // console.log("Order UID | EXTERNAL REFERENCE:", orderUID);

                                    await subscriptionsCollectionRef.doc(orderUID).set(subscription_data, { merge: true });
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

                        // Add more cases for other notification types as needed
                        default:
                            // Unknown notification type
                            // Log or handle the error
                            console.error("Unknown notification type:", body.type);
                            break;
                    }

                    // Responder ao Mercado Pago (se necessário)
                    console.log("Sending response 200 to Mercado Pago");
                    res.status(200).json({ success: true });
                } else {
                    // A assinatura é inválida
                    console.log("The signatures do not match!");
                    res.status(500).json({ error: "The signatures do not match" });
                }
            } else {
                // handle the case where secret is undefined
                console.log("Nasty Bug, Undefined Secret");
                res.status(500).json({ error: "Internal Server Error - Undefined secret" });
            }
        } else {
            // handle the case where headers['x-signature'] is an array of strings
            console.log("Error in Request, x-signature is not a single string =>", req);
            console.log("Its Headers =>", headers);
            console.log("Its Body =>", body);
            res.status(500).json({ error: "Internal Server Error - x-signature is not a single string" });
        }
    } else {
        console.log("The request method is not POST");
        res.setHeader("Allow", ["POST"]);
    }
}
