import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { IBrickStyle, IBrickCustomVariables, IBrickError, IPayerIdentification, IBrickVisual } from "@mercadopago/sdk-react/bricks/util/types/common";
import { IWalletBrickCustomization, PreferenceOnSubmit } from "@mercadopago/sdk-react/bricks/wallet/types";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";

import { setUserTabNeedsUpdate } from "@/store/slices/interface_slice";

// Axios para requisições HTTP
import axios, { AxiosError } from "axios";

import { Cart_Item } from "@/types/Cart_Item";
import { Order } from "@/types/Order";

//Dados do Pedido, deve ser obtido do contexto da aplicação futuramente
const checkoutData = {
    order_type: "purchase",
    shipping_option: "pickup",
    shipping_cost: 0,
    observation: "No Observations",
};

// Verifica se a aplicação está em produção
const isProduction = process.env.IS_PRODUCTION === "true";

// Inicializa o SDK do Mercado Pago
const mercadoPagoKey = isProduction ? process.env.NEXT_PUBLIC_MP_PROD_PUBLIC_KEY : process.env.NEXT_PUBLIC_MP_DEV_PUBLIC_KEY;

//Caminho para API de Criar Preferência
const createPreferenceAPI = process.env.NEXT_PUBLIC_PATH_API_CREATE_PREFERENCE;

//Caminho para API de Criar Pedido
const createOrderAPI = process.env.NEXT_PUBLIC_PATH_API_CREATE_ORDER;

//Caminho para API de Atualizar Pedido
const updateOrderAPI = process.env.NEXT_PUBLIC_PATH_API_UPDATE_ORDER;

//Caminho para API de Atualizar Usuário
const updateUserAPI = process.env.NEXT_PUBLIC_PATH_API_UPDATE_USER;

if (!createPreferenceAPI || !createOrderAPI || !updateOrderAPI || !updateUserAPI) {
    throw new Error("The API paths are not defined");
}

if (mercadoPagoKey) {
    initMercadoPago(mercadoPagoKey);
}

const WalletMercadoPago = () => {
    const dispatch = useDispatch();

    const userTabNeedsUpdateAction = () => {
        dispatch(setUserTabNeedsUpdate(true));
    };

    let customization: IWalletBrickCustomization;
    customization = { texts: { action: "buy", valueProp: "smart_option" } };

    const cartItems = useSelector((state: RootState) => state.cart.cartItems as Cart_Item[]);
    const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    const customer = useSelector((state: RootState) => state.user.currentUser);

    const onSubmit = async () => {
        // console.log("Wallet Brick Payment Submitted!");

        if (cartItems.length === 0) {
            console.log("Cart is empty!");
            return;
        }

        return new Promise((resolve, reject) => {
            console.log("Payment Process Started! Sending Cart Items to Mercado Pago...");
            fetch(createPreferenceAPI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cartItems), // A method that converts an JavaScript object or value to a JSON string.
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Payment Failed! HTTP Error: ${response.status}`);
                    }
                    return response.text(); // A method provided by the Fetch API in JavaScript. It's used to read a Response stream to completion as text.
                })
                .then((data) => {
                    const preference = JSON.parse(data); // A method that takes a JSON string and converts it into a JavaScript object.
                    // console.log("Preference Created =>", preference);
                    // console.log("Preference ID =>", preference.id);
                    // console.log("External Reference ID =>", preference.external_reference);
                    return preference;
                })
                .then((preference) => {
                    const order: Order = {
                        order_preference_id: preference.id,
                        order_external_reference: preference.external_reference,
                        order_items: cartItems,
                        order_date: new Date(),
                        order_type: checkoutData.order_type,

                        shipping_option: checkoutData.shipping_option,
                        shipping_cost: checkoutData.shipping_cost,
                        observation: checkoutData.observation,
                        total: cartTotal,

                        customer_ref: customer.id,
                        customer_type: "no-type",
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

                    fetch(createOrderAPI, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(order),
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Order Failed! HTTP Error: ${response.status}`);
                            }

                            return response.text();
                        })
                        .then((data) => {
                            const order = JSON.parse(data);
                            console.log("Order Created =>", order.order_data);

                            const updatedCustomer = {
                                ...customer,
                                orders: [...customer.orders, order.order_data.order_external_reference],
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

                                console.log("User Updated =>", updatedCustomer);
                                console.log("Order Created =>", order.order_data.order_preference_id);
                                setTimeout(() => {
                                    userTabNeedsUpdateAction();
                                }, 2000);
                                resolve(order.order_data.order_preference_id);
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
                .finally(() => {
                    console.log("Payment Process Finished!");
                });
        });
    };

    const onError = async (error: IBrickError) => {
        console.log("Warning! Wallet Brick Error =>", error);
    };

    const onReady = async () => {
        console.log("Wallet Brick is ready!");
    };

    return (
        <Wallet
            initialization={{ redirectMode: "blank" }}
            customization={customization}
            onSubmit={onSubmit}
            onReady={onReady}
            onError={onError}
            locale="pt-BR"
        />
    );
};

export default WalletMercadoPago;

/* Async/Await Example

const onSubmit = async () => {
    console.log("Wallet Brick Payment Submitted!");

    if (cartItems.length === 0) {
        console.log("Cart is empty!");
        return;
    }

    try {
        const response = await fetch("/api/create_preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cartItems),
        });

        if (!response.ok) {
            throw new Error(`Payment Failed! HTTP Error: ${response.status}`);
        }

        const data = await response.text();
        const preference = JSON.parse(data);
        console.log("Preference Created =>", preference);
        console.log("Preference ID =>", preference.id);
        console.log("External Reference ID =>", preference.external_reference);

        const orderResponse = await fetch("/api/create_order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(preference),
        });

        if (!orderResponse.ok) {
            throw new Error(`Order Failed! HTTP Error: ${orderResponse.status}`);
        }

        const orderData = await orderResponse.text();
        console.log("Order Created =>", orderData);
        return orderData;
    } catch (error) {
        console.log("Payment Error =>", error);
        throw error;
    } finally {
        console.log("Payment Process Finished!");
    }
};

*/
