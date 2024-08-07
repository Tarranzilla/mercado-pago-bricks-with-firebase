import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";

import Link from "next/link";

import { setUserTabNeedsUpdate, setUserTabOpen, setCartOpen } from "@/store/slices/interface_slice";

import { motion as m, useScroll, useSpring } from "framer-motion";

import { User } from "@/types/User";
import { Cart_Item } from "@/types/Cart_Item";
import { Order } from "@/types/Order";
import axios from "axios";

type createPreferenceResponse = {
    id: string;
    external_reference: string;
    full_preference: any;
};

// Verifica se a aplicação está em produção
// console.log("IS_PRODUCTION ENV =>", process.env.NEXT_PUBLIC_IS_PRODUCTION);
const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";
// console.log("IS_PRODUCTION =>", isProduction);

//Caminho para API de Criar Preferência
const createPreferenceAPI = process.env.NEXT_PUBLIC_PATH_API_CREATE_PREFERENCE;

//Caminho para API de Criar Pedido
const createOrderAPI = process.env.NEXT_PUBLIC_PATH_API_CREATE_ORDER;

//Caminho para API de Atualizar Pedido
const updateOrderAPI = process.env.NEXT_PUBLIC_PATH_API_UPDATE_ORDER;

//Caminho para API de Atualizar Usuário
const updateUserAPI = process.env.NEXT_PUBLIC_PATH_API_UPDATE_USER;

if (!createPreferenceAPI || !createOrderAPI || !updateOrderAPI || !updateUserAPI) {
    throw new Error("API Paths are not defined!");
}

const getCounterAPI = process.env.NEXT_PUBLIC_PATH_API_GET_COUNTER;
if (!getCounterAPI) {
    throw new Error("Counter API Path is not defined!");
}

const updateCounterAPI = process.env.NEXT_PUBLIC_PATH_API_UPDATE_COUNTER;
if (!updateCounterAPI) {
    throw new Error("Counter API Path is not defined!");
}

const Client_Checkout = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const customer = useSelector((state: RootState) => state.user.currentUser);

    const [processingPayment, setProcessingPayment] = useState<boolean>(false);

    const customer_has_not_updated_his_phone = customer?.telephone === "Nenhum Número de Telefone Definido" || customer?.telephone === "";
    console.log("Customer =>", customer);
    console.log("Customer telephone =>", customer?.telephone);
    console.log("Customer has not updated his phone =>", customer_has_not_updated_his_phone);

    const customer_has_not_updated_his_address =
        customer?.name === "Nenhum Nome Definido" ||
        customer?.name === "" ||
        customer?.email === "Nenhum Email Definido" ||
        customer?.email === "" ||
        customer?.telephone === "Nenhum Número de Telefone Definido" ||
        customer?.telephone === "" ||
        customer?.address?.street === "Nenhuma Rua Definida" ||
        customer?.address?.street === "" ||
        customer?.address?.number === "Nenhum Número Definido" ||
        customer?.address?.number === "" ||
        customer?.address?.city === "Nenhuma Cidade Definida" ||
        customer?.address?.city === "" ||
        customer?.address?.state === "Nenhum Estado Definido" ||
        customer?.address?.state === "" ||
        customer?.address?.zip === "Nenhum Código Postal Definido" ||
        customer?.address?.zip === "";

    // customer?.address?.complement === "Nenhum Complemento Definido" ||

    const emptyCart = cartItems.length < 1;

    const [receiveOption, setReceiveOption] = useState<"Retirada" | "Entrega">("Retirada");
    const shipping_cost = receiveOption === "Retirada" ? 0 : 15;
    const [receiveObservation, setReceiveObservation] = useState<string>("");

    const userTabNeedsUpdateAction = () => {
        dispatch(setUserTabNeedsUpdate(true));
    };

    const setUserTabOpenAction = (open: boolean) => {
        dispatch(setUserTabOpen(open));
    };

    const setCartOpenAction = (open: boolean) => {
        dispatch(setCartOpen(open));
    };

    const processPaymentAction = async () => {
        // console.log("Botão de Pagamento Clicado!");

        if (!customer) {
            console.log("Usuário não encontrado! O Pedido não pode ser efetuado!");
            return;
        }

        if (cartItems.length === 0) {
            console.log("O Carrinho está vazio! O Pedido não pode ser efetuado!");
            return;
        }

        let new_preference: createPreferenceResponse;

        return new Promise((resolve, reject) => {
            setProcessingPayment(true);
            console.log("Proceso de Pagamento Iniciado! Enviando Itens do Carrinho para Criar uam Preferencia no Mercado Pago...");
            fetch(createPreferenceAPI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ customer, cartItems }), // A method that converts an JavaScript object or value to a JSON string.
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Payment Failed! HTTP Error: ${response.status}`);
                    }
                    return response.text(); // A method provided by the Fetch API in JavaScript. It's used to read a Response stream to completion as text.
                })
                .then((data) => {
                    new_preference = JSON.parse(data); // A method that takes a JSON string and converts it into a JavaScript object.
                    // console.log("Preference Created =>", new_preference);
                    // console.log("Preference ID =>", preference.id);
                    // console.log("External Reference ID =>", preference.external_reference);
                    return new_preference;
                })
                .then((new_preference) => {
                    // enviar apenas os dados necessários e gerenciar a criação do pedido no server-side
                    // buscar o numero atual de pedidos do contador de pedidos

                    /* customer, new_preference, cartItems, order_type, shipping_option, observation  */

                    const create_order_data = {
                        customer: customer,
                        new_preference: new_preference,
                        cartItems: cartItems,
                        order_type: "mercado-pago",
                        receiveOption: receiveOption,
                        observation: receiveObservation,
                    };

                    fetch(createOrderAPI, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(create_order_data),
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

                            setTimeout(() => {
                                userTabNeedsUpdateAction();
                            }, 2000);
                            resolve(order.order_data.order_preference_id);
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
                    if (new_preference.full_preference.sandbox_init_point && new_preference.full_preference.init_point) {
                        // console.log("Sandbox Init Point => ", new_preference.full_preference.sandbox_init_point);
                        // console.log("Production Init Point => ", new_preference.full_preference.init_point);
                        // console.log("Is Production => ", isProduction);

                        const destination = isProduction
                            ? new_preference.full_preference.init_point
                            : new_preference.full_preference.sandbox_init_point;

                        // console.log("Selected Init Point => ", destination);
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

    useEffect(() => {
        setCartOpenAction(false);
        setCartOpenAction(false);
    }, []);

    return (
        <>
            <div className="Checkout">
                <div className="Checkout_Content_Wrapper">
                    {processingPayment ? (
                        <div className="Checkout_Card">
                            <h1 className="Checkout_Card_Title">Finalizando Compra</h1>
                            <div className="Checkout_No_Orders">
                                <span className="material-icons">payment</span>
                                <p className="Checkout_No_Orders_Text">Processando Pagamento...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {!customer ? (
                                <div className="Checkout_Card Checkout_Card_No_User Margin_Block">
                                    <h1 className="Checkout_Card_Title">Por Favor Conecte-se</h1>

                                    <div className="Checkout_No_User">
                                        <span className="material-icons Checkout_No_User_Icon">badge</span>
                                        <p className="Checkout_No_User_Text">
                                            Você precisa estar conectado na sua conta para fazer um pedido e finalizar a compra.
                                        </p>
                                    </div>

                                    <Link href={"/#inicio"} className="Checkout_Button Checkout_Return_Btn" id="checkout-return-button">
                                        <span className="material-icons">arrow_back</span>Voltar a Página Inicial
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="Checkout_Card Checkout_Product_List_Card">
                                        <h1 className="Checkout_Card_Title">Itens do Pedido</h1>

                                        {emptyCart ? (
                                            <div className="Checkout_No_Orders">
                                                <span className="material-icons Checkout_No_Orders_Icon">list_alt</span>
                                                <p className="Checkout_No_Orders_Text">Nenhum item adicionado ao pedido.</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="User_Order_Product_List User_Order_Checkout_Product_List">
                                                    <h4>Produtos</h4>
                                                    {cartItems.map((cart_item, index) => {
                                                        return (
                                                            <div key={index} className="User_Order_Product User_Order_Checkout_Product">
                                                                <p className="User_Order_Product_Title">{cart_item.product.title}</p>
                                                                <p className="User_Order_Product_Qtty">
                                                                    <p>{cart_item.quantity}</p>
                                                                    <span>X</span>
                                                                </p>
                                                                <p className="User_Order_Product_Price">R$ {cart_item.product.price},00</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="User_Order_Total Checkout_Product_List_Total">
                                                    <h4>Valor dos Produtos</h4>
                                                    <p className="User_Order_Total_Value Checkout_Product_List_Total_Value">
                                                        R$ {cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)},00
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="Checkout_Card">
                                        <h1 className="Checkout_Card_Title">Opções de Recebimento</h1>
                                        <div className="Checkout_Receive_Options">
                                            <button
                                                className={receiveOption === "Retirada" ? "Receive_Option Active" : "Receive_Option"}
                                                onClick={() => {
                                                    const element = document.getElementById("receive_option_1");
                                                    if (element) element.click();
                                                    setReceiveOption("Retirada");
                                                }}
                                            >
                                                <span className="material-icons">store</span>
                                                <div className="Recieve_Option_Group">
                                                    <label htmlFor="receive_option_1">Retirada na Loja</label>
                                                    <a
                                                        className="Recieve_Option_Map_Link"
                                                        href="https://www.google.com.br/maps/preview"
                                                        rel="noopener noreferrer"
                                                        target="_blank"
                                                    >
                                                        <span className="material-icons">explore</span>
                                                        Confira o Endereço
                                                    </a>
                                                </div>

                                                <input type="radio" name="receive_option" id="receive_option_1" defaultChecked />
                                            </button>

                                            {customer_has_not_updated_his_address ? (
                                                <div className="Receive_Option Disabled">
                                                    <span className="material-icons">local_shipping</span>
                                                    <label htmlFor="receive_option_2">Entrega em Casa</label>
                                                    <input type="radio" name="receive_option" id="receive_option_2" />
                                                </div>
                                            ) : (
                                                <button
                                                    className={receiveOption === "Entrega" ? "Receive_Option Active" : "Receive_Option"}
                                                    onClick={() => {
                                                        const element = document.getElementById("receive_option_2");
                                                        if (element) element.click();
                                                        setReceiveOption("Entrega");
                                                    }}
                                                >
                                                    <span className="material-icons">local_shipping</span>
                                                    <label htmlFor="receive_option_2">Entrega em Casa</label>
                                                    <input type="radio" name="receive_option" id="receive_option_2" />
                                                </button>
                                            )}

                                            {customer_has_not_updated_his_address ? (
                                                <button
                                                    className="Checkout_Address_Alert"
                                                    onClick={() => {
                                                        setUserTabOpenAction(true);
                                                    }}
                                                >
                                                    <span className="material-icons">info</span>
                                                    <p>
                                                        Para habilitar a opção de Entrega em Casa, atualize as suas informações pessoais e de entrega
                                                        nas configurações da sua conta.
                                                    </p>
                                                </button>
                                            ) : (
                                                <></>
                                            )}

                                            {receiveOption === "Entrega" && (
                                                <>
                                                    <div className="User_Order_Shipping_Address">
                                                        <div className="User_Order_Shipping_Address_Header">
                                                            <h4>Endereço de Entrega</h4>
                                                            <button
                                                                className="User_Order_Shipping_Address_Edit_Btn"
                                                                onClick={() => {
                                                                    setUserTabOpenAction(true);
                                                                }}
                                                            >
                                                                <span className="material-icons">edit</span>Alterar
                                                            </button>
                                                        </div>

                                                        <p>
                                                            {customer.address.street}, {customer.address.number}
                                                            {customer.address.complement !== "Nenhum Complemento Definido"
                                                                ? `, ${customer.address.complement}`
                                                                : ""}
                                                        </p>
                                                        <p>
                                                            {customer.address.city}, {customer.address.state}, {customer.address.zip}
                                                        </p>
                                                    </div>
                                                    <div className="User_Order_Shipping_Info">
                                                        <span className="material-icons">info</span>
                                                        <p>
                                                            Para envios fora da cidade de Curitiba taxas adicionais serão cobradas - Após a
                                                            finalização da compra entraremos em contato para lhe repassar o valor extra necessário e
                                                            combinar uma data.
                                                        </p>
                                                    </div>
                                                    <div className="User_Order_Total User_Shipping_Total">
                                                        <h4>Valor da Entrega</h4>
                                                        <p className="User_Order_Shipping_Value">R$ {shipping_cost},00</p>
                                                    </div>
                                                </>
                                            )}

                                            <div className="Recieve_Option_Observation">
                                                <h4 className="Observation_Title">
                                                    <span className="material-icons">visibility</span>Observações
                                                </h4>
                                                <textarea
                                                    id="receive_option_observation_text_area"
                                                    maxLength={512}
                                                    onChange={() => {
                                                        const element = document.getElementById(
                                                            "receive_option_observation_text_area"
                                                        ) as HTMLTextAreaElement;
                                                        if (element) setReceiveObservation(element.value);
                                                    }}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="Checkout_Card">
                                        <h1 className="Checkout_Card_Title">Resumo do Pedido</h1>
                                        <div className="Checkout_Order_Summary">
                                            <div className="Checkout_Total">
                                                <h4>
                                                    <span className="material-icons">category</span>Valor do Produtos
                                                </h4>
                                                <p className="Checkout_Total_Value">
                                                    R$ {cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)},00
                                                </p>
                                            </div>
                                            <div className="Checkout_Total">
                                                <h4>
                                                    <span className="material-icons">local_shipping</span>Valor da Entrega
                                                </h4>
                                                <p className="Checkout_Total_Value">R$ {shipping_cost},00</p>
                                            </div>
                                            <div className="Checkout_Total">
                                                <h4>
                                                    <span className="material-icons">functions</span> Valor Total
                                                </h4>
                                                <p className="Checkout_Total_Value">
                                                    R$ {cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) + shipping_cost}
                                                    ,00
                                                </p>
                                            </div>

                                            {customer_has_not_updated_his_phone && (
                                                <div
                                                    className="Checkout_Address_Alert Checkout_Payment_Alert"
                                                    onClick={() => {
                                                        setUserTabOpenAction(true);
                                                    }}
                                                >
                                                    <span className="material-icons">info</span>
                                                    <p>
                                                        Para prosseguir ao pagamento você precisa adicionar pelomenos o seu número de telefone nas
                                                        configurações da sua conta.
                                                    </p>
                                                </div>
                                            )}

                                            <div className="Checkout_Footer_Buttons">
                                                <Link
                                                    href={"/#inicio"}
                                                    className="Cart_Footer_Checkout_Button User_Order_Total_Btn"
                                                    id="checkout-return-button"
                                                >
                                                    <span className="material-icons">arrow_back</span>Voltar a Página Inicial
                                                </Link>

                                                <button
                                                    id="checkout-payment-button"
                                                    className={
                                                        emptyCart || customer_has_not_updated_his_phone
                                                            ? "Cart_Footer_Checkout_Button User_Order_Total_Btn Disabled"
                                                            : " Cart_Footer_Checkout_Button User_Order_Total_Btn"
                                                    }
                                                    onClick={() => {
                                                        console.log("Processando Pagamento...");
                                                        if (!emptyCart && !customer_has_not_updated_his_phone) {
                                                            processPaymentAction();
                                                        }
                                                    }}
                                                >
                                                    {emptyCart && <>Para prosseguir ao pagamento adicione itens ao pedido</>}
                                                    {customer_has_not_updated_his_phone && (
                                                        <>Adicione um telefone na sua conta para finalizar o pedido</>
                                                    )}
                                                    {!emptyCart && !customer_has_not_updated_his_phone && <>Prosseguir ao Pagamento</>}
                                                    <span className="material-icons">payment</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Client_Checkout;
