import { useState, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setUserTabNeedsUpdate, setUserTabOpen } from "@/store/slices/interface_slice";

import { User as User_Local } from "@/types/User";
import { Subscription } from "@/types/Subscription";

import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

// Framer motion para animações
import { motion as m, AnimatePresence, useScroll, useSpring } from "framer-motion";

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

// Verifica se a aplicação está em produção
// console.log("IS_PRODUCTION ENV =>", process.env.NEXT_PUBLIC_IS_PRODUCTION);
const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";
// console.log("IS_PRODUCTION =>", isProduction);

//Caminho para API de Criar Preferência
const createSubscriptionPreferenceAPI = process.env.NEXT_PUBLIC_PATH_API_CREATE_SUBSCRIPTION_PREFERENCE;

//Caminho para API de Criar Pedido
const createSubscriptionAPI = process.env.NEXT_PUBLIC_PATH_API_CREATE_SUBSCRIPTION;

//Caminho para API de Atualizar Pedido
const updateOrderAPI = process.env.NEXT_PUBLIC_PATH_API_UPDATE_ORDER;

//Caminho para API de Atualizar Usuário
const updateUserAPI = process.env.NEXT_PUBLIC_PATH_API_UPDATE_USER;

if (!createSubscriptionPreferenceAPI || !createSubscriptionAPI || !updateOrderAPI || !updateUserAPI) {
    throw new Error("API Paths are not defined!");
}

const Client_Subscription_Banner = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const customer = useSelector((state: RootState) => state.user.currentUser as User_Local);
    const anonymousCustomer = customer === null || customer.name === "Usuário Anônimo";

    const customerIsSubscriber = customer?.isSubscriber || false;

    const customer_has_not_updated_his_address =
        customer?.name === "Nenhum Nome Definido" ||
        customer?.email === "Nenhum Email Definido" ||
        customer?.telephone === "Nenhum Número de Telefone Definido" ||
        customer?.address?.street === "Nenhuma Rua Definida" ||
        customer?.address?.number === "Nenhum Número Definido" ||
        customer?.address?.city === "Nenhuma Cidade Definida" ||
        customer?.address?.state === "Nenhum Estado Definido" ||
        customer?.address?.zip === "Nenhum Código Postal Definido";

    const setUserTabOpenAction = (isOpen: boolean) => {
        dispatch(setUserTabOpen(isOpen));
    };

    const [processingPayment, setProcessingPayment] = useState(false);

    const userTabNeedsUpdateAction = () => {
        dispatch(setUserTabNeedsUpdate(true));
    };

    const subscriptionRequest: createSubscriptionPreferenceRequest = {
        plan_id: "clube-tropical-3-meses",
        plan_name: "Clube Tropical",
        duration: 3,
        start_date: new Date().toISOString(),
    };

    const processSubscriptionPaymentAction = async () => {
        // console.log("Botão de Pagamento Clicado!");

        if (!customer) {
            console.log("Usuário não encontrado! O Pedido de Assinatura não pode ser efetuado!");
            return;
        }

        let new_subscription_preference: createSubscriptionPreferenceResponse;

        return new Promise((resolve, reject) => {
            setProcessingPayment(true);
            console.log(
                "Proceso de Pagamento Iniciado! Enviando Preferencias do Usuário e Detalhes da Assinatura para Criar uma Preferencia no Mercado Pago..."
            );
            fetch(createSubscriptionPreferenceAPI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ customer, subscriptionRequest }), // A method that converts an JavaScript object or value to a JSON string.
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Payment Failed! HTTP Error: ${response.status}`);
                    }
                    return response.text(); // A method provided by the Fetch API in JavaScript. It's used to read a Response stream to completion as text.
                })
                .then((data) => {
                    new_subscription_preference = JSON.parse(data); // A method that takes a JSON string and converts it into a JavaScript object.
                    console.log("Preference Created =>", new_subscription_preference);

                    return new_subscription_preference;
                })
                .then((new_subscription_preference) => {
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

                    console.log("Subscription Created =>", new_subscription);

                    fetch(createSubscriptionAPI, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(new_subscription),
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Order Failed! HTTP Error: ${response.status}`);
                            }

                            return response.text();
                        })
                        .then((data) => {
                            const subscription = JSON.parse(data);
                            // console.log("Order Created =>", order.order_data);
                            console.log(subscription);
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

                                // console.log("User Updated =>", updatedCustomer);
                                // console.log("Order Created =>", order.order_data.order_preference_id);
                                setTimeout(() => {
                                    userTabNeedsUpdateAction();
                                }, 2000);
                                resolve(subscription.subscription_data.subscription_preference_id);
                            });
                        })
                        .catch((error) => {
                            console.log("Order Error =>", error);
                            reject(error);
                        });
                })
                .catch((error) => {
                    console.log("Payment Error =>", error);
                    reject(error);
                })
                .then(() => {
                    if (new_subscription_preference.full_preference.sandbox_init_point && new_subscription_preference.full_preference.init_point) {
                        // console.log("Sandbox Init Point => ", new_preference.full_preference.sandbox_init_point);
                        // console.log("Production Init Point => ", new_preference.full_preference.init_point);
                        // console.log("Is Production => ", isProduction);

                        const destination = isProduction
                            ? new_subscription_preference.full_preference.init_point
                            : new_subscription_preference.full_preference.sandbox_init_point;

                        console.log("Selected Init Point => ", destination);
                        return destination;
                    } else {
                        alert("Erro ao processar o pagamento! Tente novamente mais tarde.");
                        throw new Error("Payment Error => Init Point not found!");
                    }
                })
                .then((destination) => {
                    router.push(destination);
                })
                .finally(() => {
                    console.log("Payment Process Finished!");
                    setProcessingPayment(false);
                });
        });
    };

    return (
        <div className="Subsctiption_Banner">
            {processingPayment ? (
                <div className="Subscription_Banner_Card">
                    <h1 className="Subscription_Banner_Title">Clube Tropical</h1>
                    <div className="User_No_Orders">
                        <span className="material-icons">loyalty</span>
                        <p className="User_No_Orders_Text">Processando Pagamento...</p>
                    </div>
                </div>
            ) : (
                <div className="Subscription_Banner_Card">
                    <h1 className="Subscription_Banner_Title">Clube Tropical</h1>
                    <h2 className="Subsctiption_Banner_Subtitle">Que tal ter uma seleção de chocolates deliciosos chegando todo mês na sua casa?</h2>
                    <p className="Subsctiption_Banner_Description">
                        Membros do Clube Tropical recebem mensalmente uma caixa com 6 chocolates especiais, feitos com cacau de origem única - E
                        também possuem acesso a descontos de 10% em todos os pedidos.
                    </p>

                    <div className="Subscription_Banner_Buttons_Container">
                        <button
                            className={
                                anonymousCustomer || customer_has_not_updated_his_address
                                    ? "Subscription_Banner_Button Disabled"
                                    : "Subscription_Banner_Button"
                            }
                            onClick={() => {
                                if (!anonymousCustomer && !customer_has_not_updated_his_address && !customerIsSubscriber) {
                                    console.log("Processando pagamento de Assinatura!");
                                    processSubscriptionPaymentAction();
                                } else {
                                    setUserTabOpenAction(true);
                                }
                            }}
                        >
                            <span className="material-icons User_No_Orders_Icon">loyalty</span>
                            <p className="Subscription_Banner_Button_Text">
                                {customerIsSubscriber ? "voce faz parte do clube tropical!" : "Quero fazer parte do clube tropical!"}
                            </p>
                        </button>

                        {anonymousCustomer && (
                            <button
                                className="Subscription_Banner_Warning"
                                onClick={() => {
                                    setUserTabOpenAction(true);
                                }}
                            >
                                <span className="material-icons">badge</span>{" "}
                                <p className="Subscription_Banner_Button_Text">Crie uma conta ou conecte-se para realizar a assinatura</p>
                            </button>
                        )}

                        {customer_has_not_updated_his_address && (
                            <button
                                onClick={() => {
                                    setUserTabOpenAction(true);
                                }}
                                className="Subscription_Banner_Warning"
                            >
                                <span className="material-icons">info</span>
                                <p className="Subscription_Banner_Button_Text">
                                    Para assinar o Clube Tropical, atualize as suas informações pessoais e de entrega nas configurações da sua conta
                                </p>
                            </button>
                        )}
                    </div>

                    <div className="Subscription_Banner_Image_Container">
                        <Image
                            src="/subscription_imgs/Clube_Tropical_001.png"
                            alt="Chocolate Box"
                            width={400}
                            height={400}
                            quality={100}
                            className="Subscription_Banner_Image"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Client_Subscription_Banner;
